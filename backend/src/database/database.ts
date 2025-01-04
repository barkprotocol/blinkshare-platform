import 'reflect-metadata';
import { Repository, DataSource, InsertResult, UpdateResult, MoreThan, Between, Not, IsNull } from 'typeorm';
import { Guild } from './entities/guild';
import { Role } from './entities/role';
import { AccessToken } from './entities/access-token';
import { RolePurchase } from './entities/role-purchase';
import { Wallet } from './entities/wallet';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

let dataSource: DataSource;
let guildRepository: Repository<Guild>;
let accessTokenRepository: Repository<AccessToken>;
let rolePurchaseRepository: Repository<RolePurchase>;
let walletRepository: Repository<Wallet>;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export async function initializeDatabase() {
  dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres',
    schema: 'public',
    entities: [Guild, Role, AccessToken, RolePurchase, Wallet],
    synchronize: false,
    logging: true
  });

  try {
    await dataSource.initialize();
    logger.info('Database connected successfully');

    guildRepository = dataSource.getRepository(Guild);
    accessTokenRepository = dataSource.getRepository(AccessToken);
    rolePurchaseRepository = dataSource.getRepository(RolePurchase);
    walletRepository = dataSource.getRepository(Wallet);
  } catch (err) {
    logger.error('Error during database initialization', err);
    throw new Error('Database connection failed');
  }
}

export async function findAllGuildIdsSortedByCreateTime(): Promise<string[]> {
  const guilds = await guildRepository
    .createQueryBuilder('guild')
    .select('guild.id')
    .where('hidden = :hidden', { hidden: false })
    .orderBy('guild.createTime', 'DESC')
    .getMany();

  return guilds.map(({ id }) => id);
}

export async function getAllGuilds(): Promise<Guild[]> {
  return await guildRepository.find();
}

export async function insertGuild(guild: Guild): Promise<InsertResult> {
  return await dataSource.transaction(async (entityManager) => {
    try {
      const newGuild = await entityManager.insert(Guild, guild);

      await Promise.all(
        guild.roles.map((role: Partial<Role>) =>
          entityManager.save(Role, { ...role, guild: { id: guild.id } })
        )
      );

      logger.info(`Guild ${guild.id} inserted successfully`);
      return newGuild;
    } catch (error) {
      logger.error(`Error inserting guild ${guild.id}`, error);
      throw new Error('Failed to insert guild');
    }
  });
}

export async function updateGuild(guildId: string, guild: Guild): Promise<UpdateResult> {
  return await dataSource.transaction(async (entityManager) => {
    try {
      const updatedGuild = await entityManager.update(Guild, guildId, { ...guild, roles: undefined });

      if (guild.roles?.length) {
        const existingRoles = await entityManager.find(Role, { where: { guild: { id: guildId } } });
        const rolesToDelete = existingRoles.filter(
          (existingRole) => !guild.roles.some(role => role.id === existingRole.id)
        );
        await Promise.all(rolesToDelete.map((role) => entityManager.delete(Role, role.id)));

        await Promise.all(
          guild.roles.map((role: Partial<Role>) =>
            entityManager.save(Role, { ...role, guild: { id: guild.id } })
          )
        );
      }

      logger.info(`Guild ${guildId} updated successfully`);
      return updatedGuild;
    } catch (error) {
      logger.error(`Error updating guild ${guildId}`, error);
      throw new Error('Failed to update guild');
    }
  });
}

export async function findGuildById(id: string): Promise<Guild | undefined> {
  const guild = await guildRepository.findOne({
    where: { id },
    relations: ['roles'],
  });
  
  if (!guild) return undefined;

  guild.roles.sort((a, b) => a.amount - b.amount);
  guild.roles.forEach((role) => {
    role.amount = parseFloat(role.amount.toString()).toFixed(5).replace(/(\.0+|(\.\d+?)0+)$/, '$2');
  });

  guild.limitedTimeQuantity = guild.limitedTimeQuantity?.toString();
  return guild;
}

export async function findAccessTokenByCode(code: string): Promise<AccessToken | undefined> {
  return await accessTokenRepository.findOne({
    where: { code, expiresAt: MoreThan(new Date()) },
  });
}

export async function saveNewAccessToken(authToken: AccessToken): Promise<AccessToken> {
  return await accessTokenRepository.save(authToken);
}

export async function saveRolePurchase(rolePurchase: RolePurchase): Promise<RolePurchase> {
  return await rolePurchaseRepository.save(rolePurchase);
}

export async function getExpiringRoles(): Promise<RolePurchase[]> {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return await rolePurchaseRepository
    .createQueryBuilder('rolePurchase')
    .leftJoinAndSelect('rolePurchase.guild', 'guild')
    .leftJoinAndSelect('rolePurchase.role', 'role')
    .where('rolePurchase.expiresAt <= :threeDaysFromNow', { threeDaysFromNow })
    .andWhere('rolePurchase.expiresAt > :now', { now })
    .andWhere('guild.id IS NOT NULL')
    .andWhere('role.id IS NOT NULL')
    .getMany();
}

export async function getAllRolesForUser(
  discordUserId: string,
  guildId: string,
  roleId: string,
): Promise<RolePurchase[]> {
  return await rolePurchaseRepository.find({
    where: {
      discordUserId,
      guild: { id: guildId },
      role: { id: roleId },
    },
  });
}

export async function createUserWallet(discordUserId: string, address: string): Promise<Wallet> {
  return await walletRepository.save(new Wallet(address, discordUserId));
}

export async function getSubscriptionsByGuildId(guildId: string): Promise<RolePurchase[]> {
  return await rolePurchaseRepository.find({
    where: { guild: { id: guildId } },
    relations: ['guild', 'role'],
    order: { createTime: 'DESC' },
  });
}

// Example usage
async function main() {
  await initializeDatabase();
  
  // Example: Find all guild IDs
  const guildIds = await findAllGuildIdsSortedByCreateTime();
  console.log('Guild IDs:', guildIds);

  // Example: Get all guilds
  const guilds = await getAllGuilds();
  console.log('Number of guilds:', guilds.length);

  // Example: Find a guild by ID
  if (guildIds.length > 0) {
    const guild = await findGuildById(guildIds[0]);
    console.log('First guild:', guild);
  }

  // Close the database connection
  await dataSource.destroy();
}

main().catch(error => console.error('Error in main function:', error));