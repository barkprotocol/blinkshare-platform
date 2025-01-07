import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { Telegraf } from 'telegraf'; 
import { createMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/umi';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Telegram Bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY); 

// Connect to Solana's Devnet (or other networks like Testnet/Mainnet)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Placeholder: Replace with your wallet's keypair (preferably stored securely, not hardcoded)
const adminKeypair = Keypair.generate();  // Use a securely stored keypair here, not generated each time

// Initialize Metaplex for NFT minting
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(adminKeypair))
  .use(bundlrStorage());

// Command to check balance of a wallet
bot.command('balance', async (ctx) => {
  const walletAddress = ctx.message.text.split(' ')[1]; // Get wallet address from command input
  if (!walletAddress) {
    return ctx.reply('Please provide a Solana wallet address.');
  }

  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    ctx.reply(`The balance of the wallet is: ${balance / 1e9} SOL`);
  } catch (error) {
    ctx.reply('Error fetching wallet balance: ' + error.message);
  }
});

// Command to send SOL from one wallet to another (Donation)
bot.command('donate', async (ctx) => {
  const [fromWallet, amount, memo] = ctx.message.text.split(' ').slice(1);
  if (!fromWallet || !amount) {
    return ctx.reply('Usage: /donate <fromWallet> <amount> [memo]');
  }

  try {
    const fromPublicKey = new PublicKey(fromWallet);
    const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports (smallest unit)

    // Create a transaction to send SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: adminKeypair.publicKey, // Donations go to admin's wallet
        lamports,
      })
    );

    // Add memo if provided
    if (memo) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: adminKeypair.publicKey,
          lamports: 0, // No SOL transferred for memo
        })
      );
      // Add memo to the transaction
      transaction.add(
        SystemProgram.memo({
          data: memo, // Memo content
        })
      );
    }

    // Sign the transaction using the sender's keypair (signer)
    const signature = await connection.sendTransaction(transaction, [adminKeypair]); // Replace with actual signer
    await connection.confirmTransaction(signature);

    ctx.reply(`Donation successful! Transaction signature: ${signature}`);
  } catch (error) {
    ctx.reply('Error processing donation: ' + error.message);
  }
});

// Command to send a gift (NFT or Token as Image)
bot.command('gift', async (ctx) => {
  const [toWallet, imageUrl, description] = ctx.message.text.split(' ').slice(1);
  if (!toWallet || !imageUrl) {
    return ctx.reply('Usage: /gift <toWallet> <imageUrl> [description]');
  }

  try {
    const recipientPublicKey = new PublicKey(toWallet);

    // Example: Create an NFT with the image URL
    const { nft } = await metaplex.nfts().create({
      uri: imageUrl, // Image URL for the NFT
      name: 'Gifted NFT',
      symbol: 'NFT',
      description: description || 'A special gift NFT',
    });

    // Send the NFT as a gift
    await metaplex.nfts().send(nft, recipientPublicKey);
    ctx.reply(`Gift sent successfully to ${toWallet}!\nNFT details: ${nft.uri}`);
  } catch (error) {
    ctx.reply('Error sending gift: ' + error.message);
  }
});

// Command to mint an NFT with image
bot.command('mint', async (ctx) => {
  const [uri, description] = ctx.message.text.split(' ').slice(1);
  if (!uri) {
    return ctx.reply('Usage: /mint <metadataUri> [description]');
  }

  try {
    // Mint the NFT using the provided metadata URI and description
    const { nft } = await metaplex.nfts().create({
      uri: uri, // Metadata URI for the NFT
      name: 'Minted NFT',
      symbol: 'NFT',
      description: description || 'A new minted NFT',
    });

    ctx.reply(`NFT Minted! NFT details: ${nft.uri}`);
  } catch (error) {
    ctx.reply('Error minting NFT: ' + error.message);
  }
});

// Command to make a payment (Send SOL) with memo
bot.command('pay', async (ctx) => {
  const [fromWallet, toWallet, amount, memo] = ctx.message.text.split(' ').slice(1);
  if (!fromWallet || !toWallet || !amount) {
    return ctx.reply('Usage: /pay <fromWallet> <toWallet> <amount> [memo]');
  }

  try {
    const fromPublicKey = new PublicKey(fromWallet);
    const toPublicKey = new PublicKey(toWallet);
    const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports (smallest unit)

    // Create a transaction to send SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    // Add memo if provided
    if (memo) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: 0, // No SOL transferred for memo
        })
      );
      // Add memo to the transaction
      transaction.add(
        SystemProgram.memo({
          data: memo, // Memo content
        })
      );
    }

    // Sign the transaction using the sender's keypair (signer)
    const signature = await connection.sendTransaction(transaction, [adminKeypair]); // Replace with actual signer
    await connection.confirmTransaction(signature);

    ctx.reply(`Payment successful! Transaction signature: ${signature}`);
  } catch (error) {
    ctx.reply('Error processing payment: ' + error.message);
  }
});

// Start the bot
bot.launch().then(() => {
  console.log('Telegram bot is running...');
});

// Handle shutdown gracefully
process.once('SIGINT', () => {
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});
