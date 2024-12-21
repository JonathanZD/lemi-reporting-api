import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function PaymentStatus() {
  const router = useRouter()
  const { paymentData } = router.query
  console.log('paymentData from router query:', paymentData)

  const [paymentInfo, setPaymentInfo] = useState<any | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentData) {
        try {
          const decodedData = JSON.parse(decodeURIComponent(paymentData as string))
          console.log('Decoded paymentData:', decodedData)
          setPaymentInfo(decodedData)

          if (decodedData.tx_ref) {
            const response = await fetch(`/api/verify-payment?tx_ref=${decodedData.tx_ref}&paymentData=${paymentData}`)
            const result = await response.json()

            console.log('Verify response:', result)
            if (result.response.status === 'success' || result.response.status === 'Donation already successful') {
              switch(result.response.status){
                case 'success':
                  setStatus('success')
                  break;
                  case 'Donation already successful':
                  setStatus('Donation already successful')
                  break;
              }
            } else {
              setStatus('failed')
              setErrorMessage(result.response.message || 'Payment verification failed.')
            }
          } else {
            setErrorMessage('Transaction reference (tx_ref) is missing.')
            setStatus('failed')
          }
        } catch (error) {
          console.error('Error parsing paymentData:', error)
          setErrorMessage('Failed to parse payment data.')
          setStatus('failed')
        }
      }
    }

    if (paymentData) {
      verifyPayment()
    }
  }, [paymentData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(20,57.6%,44.7%)] to-[hsl(213.5,62.3%,34.3%)] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="bg-[hsl(20,57.6%,44.7%)] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Payment Status</h1>
        </div>
        <div className="p-6">
        {status === 'Donation already successful' && (
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                Thank you! Donation already successful.
              </h2>
            </div>
          )}
          {status === 'success' && (
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                Thank you! Your payment was successful.
              </h2>
            </div>
          )}
          {status === 'failed' && (
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                Sorry, your payment could not be verified.
              </h2>
              <p className="text-red-500 mt-2">{errorMessage}</p>
            </div>
          )}
          {status === null && (
            <div className="text-center mb-6">
              <Loader2 className="w-16 h-16 text-[hsl(20,57.6%,44.7%)] mx-auto mb-4 animate-spin" />
              <p className="text-[hsl(var(--card-foreground))]">Verifying payment, please wait...</p>
            </div>
          )}
          {paymentInfo && (
            <div className="space-y-4">
              {Object.entries(paymentInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-sm font-medium text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="text-sm text-[hsl(var(--card-foreground))]">{value as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-xs text-center text-gray-500">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}