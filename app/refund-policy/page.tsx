import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'

export default async function RefundPolicy() {
  return (
    <SubpageLayout>
      <div className="flex flex-col gap-y-2 py-14 px-2">
        <Typography size="xl" fontWeight="normal" className="mb-4">
          Refund Policy
        </Typography>
        <Typography size="base" fontWeight="normal">
          At Live Oasis, LLC (Oasis), we strive to provide the best possible service and experience
          for our customers. However, please be aware of the following refund policy:
        </Typography>
        <Typography size="base" fontWeight="normal">
          No Refunds: Oasis does not offer refunds on any payments made for our services. All sales
          are final.
        </Typography>
        <Typography size="base" fontWeight="normal">
          Cancellation Responsibility: It is the responsibility of the customer to manage their
          subscription and cancel it if they no longer wish to continue using our services. Failure
          to cancel the subscription will result in continued charges, for which no refunds will be
          provided.
        </Typography>
        <Typography size="base" fontWeight="normal">
          Policy Acceptance: By subscribing to our services, you acknowledge and accept this refund
          policy.
        </Typography>
        <Typography size="base" fontWeight="normal">
          If you have any questions or need assistance with managing your subscription, please
          contact our customer support team at cormac@live-oasis.com.
        </Typography>
        <Typography size="base" fontWeight="normal">
          Thank you for your understanding and continued support.
        </Typography>
      </div>
    </SubpageLayout>
  )
}
