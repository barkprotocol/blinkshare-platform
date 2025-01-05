import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js"
import { useState } from "react"
import { toast } from "sonner"

export function useSolanaPay() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)

  const sendPayment = async (
    recipientAddress: string,
    amount: number,
    memo?: string
  ) => {
    if (!publicKey) {
      toast.error("Please connect your wallet")
      return false
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return false
    }

    setIsProcessing(true)
    try {
      const recipient = new PublicKey(recipientAddress)
      
      // Build the basic transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      )

      // Add memo instruction if provided
      if (memo) {
        const memoInstruction = new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(memo, "utf-8"),
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
        transaction.add(memoInstruction)
      }

      // Send the transaction
      const signature = await sendTransaction(transaction, connection)
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'processed')

      toast.success("Payment sent successfully!")
      return true
    } catch (error) {
      console.error("Error sending payment:", error)
      toast.error("Failed to send payment. Please try again.")
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    sendPayment,
    isProcessing,
  }
}
