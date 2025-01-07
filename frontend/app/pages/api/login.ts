export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { url: string; }): void; new(): any; }; }; }) {
    // Handle authentication logic here
    res.status(200).json({ url: "https://discord.com/oauth2/authorize" });
  }
  