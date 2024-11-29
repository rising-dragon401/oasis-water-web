'use client'

import { submitContact } from '@/app/actions/admin'
import { submitRequest } from '@/app/actions/labs'
import { FileUpload } from '@/components/shared/file-upload'
import ItemSelector from '@/components/shared/item-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { H1, H3, Muted, P } from '@/components/ui/typography'
import { useUserProvider } from '@/providers/UserProvider'
import { ArrowLeft, Blocks, LifeBuoy, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const ContactCard = ({
  title,
  description,
  icon,
  onClick,
  buttonLabel,
  className,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  buttonLabel: string
  className?: string
}) => {
  return (
    <div
      className={`bg-card border flex flex-col justify-between border-border p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2 mb-2">
        {icon}
        <H3>{title}</H3>
      </div>
      <P className="text-muted-foreground mb-4">{description}</P>
      <Button variant="outline" onClick={onClick} className="mt-4 w-36 self-end">
        {buttonLabel}
      </Button>
    </div>
  )
}

export default function ContactForm() {
  const { uid } = useUserProvider()

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [newItemName, setNewItemName] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeForm, setActiveForm] = useState<string | null>(null)

  const fadeClass = activeForm ? 'fade-in' : ''

  async function handleSubmit() {
    if (!uid) {
      toast('Please login to submit a request')
      return
    }

    const thisName = activeForm === 'existing_item' ? selectedItem?.name : newItemName

    let type = activeForm === 'existing_item' ? selectedItem?.type : null
    if (type === 'item') {
      type = 'bottled_water'
    }

    if (!message || !thisName) {
      toast('Please fill out all fields')
      return
    }

    setLoading(true)

    const success = await submitRequest({
      name: thisName,
      productId: selectedItem?.id || null,
      productType: type || null,
      userId: uid || null,
      message,
      attachment: attachment || null,
      kind: activeForm === 'existing_item' ? 'update_existing_product' : 'request_new_product',
    })

    setLoading(false)

    if (success) {
      toast('Submitted. Thanks!')
      resetForm()
    } else {
      toast('Something went wrong. Please try again.')
    }
  }

  const handleSubmitContact = async () => {
    if (!name || !email || !message) {
      toast('Please fill out all fields')
      return
    }

    setLoading(true)

    const success = await submitContact({
      name,
      email,
      message,
    })

    setLoading(false)

    if (success) {
      toast('Thanks! We’ll get back to you soon')
      resetForm()
    } else {
      toast('Submission failed. Please try again')
    }
  }

  const resetForm = () => {
    setName(null)
    setEmail(null)
    setMessage(null)
    setSelectedItem(null)
    setNewItemName(null)
    setAttachment(null)
    setActiveForm(null)
  }

  const handleSupportClick = () => {
    navigator.clipboard.writeText('hello@live-oasis.com')
    toast('Email address copied to clipboard!')
  }

  return (
    <>
      <div className="flex flex-col w-full max-w-2xl mx-auto pb-10">
        {activeForm && (
          <Button
            variant="ghost"
            onClick={resetForm}
            className="self-start mb-4 border-none rounded-md px-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Contact
          </Button>
        )}
        {!activeForm ? (
          <div className="flex flex-col gap-4 w-full md:mt-24 mt-10">
            <div className="flex flex-col gap-2 justify-center items-center">
              <H1 className="text-left md:text-3xl text-2xl ">Contribute and support</H1>
              <Muted className="mb-4 text-center">
                Help improve Oasis by sharing updated lab reports, scientific studies, or requesting
                new products. Also, get in touch if you have any questions or feedback.
              </Muted>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 md:mt-10 mt-4">
              <ContactCard
                title="Update listing"
                description="Have more data on an existing item? Let us know so we can update the listing."
                icon={<Blocks className="w-6 h-6 text-primary" />}
                onClick={() => setActiveForm('existing_item')}
                buttonLabel="Share details"
              />
              <ContactCard
                title="New item"
                description="Can't find something on Oasis? Send us a note so we can add it."
                icon={<Search className="w-6 h-6 text-primary" />}
                onClick={() => setActiveForm('new_item')}
                buttonLabel="Request"
              />
              <ContactCard
                title="Support"
                description="Get help with any Oasis inquires or issues."
                icon={<LifeBuoy className="w-6 h-6 text-primary" />}
                onClick={handleSupportClick}
                buttonLabel="Email us"
                className="block md:hidden"
              />
            </div>
            <div className="md:grid grid-cols-1 hidden mt-4">
              <ContactCard
                title="Support"
                description="Get help with any Oasis inquires or issues."
                icon={<LifeBuoy className="w-6 h-6 text-primary" />}
                onClick={handleSupportClick}
                buttonLabel="Email us"
              />
            </div>
          </div>
        ) : (
          <div className={`flex flex-col gap-4 max-w-xl w-full ${fadeClass}`}>
            {activeForm === 'contact' && (
              <>
                <div className="flex items-center gap-2 ">
                  <LifeBuoy className="w-6 h-6 text-primary" />
                  <H3>Support</H3>
                </div>
                <Muted className="mb-4">
                  Send us a message and we will get back to you as soon as possible
                </Muted>
                <Input
                  placeholder="Your name"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Textarea
                  placeholder="Message"
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </>
            )}
            {activeForm === 'existing_item' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Blocks className="w-6 h-6 text-primary" />
                  <H3>Item Update</H3>
                </div>
                <Muted className="">
                  Submit a change request or new data regarding an existing item
                </Muted>
                <ItemSelector item={selectedItem} setItem={setSelectedItem} />
                <Textarea
                  placeholder="Message"
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <FileUpload file={attachment} setFile={setAttachment} />
              </>
            )}
            {activeForm === 'new_item' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-6 h-6 text-primary" />
                  <H3>New Item</H3>
                </div>
                <Muted className="">What should we add next?</Muted>
                <Input
                  placeholder="Name"
                  value={newItemName || ''}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Textarea
                  placeholder="Message"
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <FileUpload file={attachment} setFile={setAttachment} />
              </>
            )}
            <Button
              variant="default"
              className="mt-6"
              onClick={activeForm !== 'contact' ? handleSubmit : handleSubmitContact}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
