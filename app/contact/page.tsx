'use client'

import { submitContact } from '@/app/actions/admin'
import { submitRequest } from '@/app/actions/labs'
import SubpageLayout from '@/components/home-layout'
import { FileUpload } from '@/components/shared/file-upload'
import ItemSelector from '@/components/shared/item-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { H1, Muted } from '@/components/ui/typography'
import { useUserProvider } from '@/providers/UserProvider'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ContactPage() {
  const { uid } = useUserProvider()

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [newItemName, setNewItemName] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [tabValue, setTabValue] = useState<string>('contact')

  async function handleSubmit() {
    if (!uid) {
      toast('Please login to submit a request')
      return
    }

    const thisName = tabValue === 'existing_item' ? selectedItem?.name : newItemName

    let type = tabValue === 'existing_item' ? selectedItem?.type : null
    if (type === 'item') {
      type = 'bottled_water'
    }

    console.log('thisName', thisName)
    console.log('message', message)

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
      kind: tabValue === 'existing_item' ? 'update_existing_product' : 'request_new_product',
    })

    setLoading(false)

    if (success) {
      toast('Submitted. Thanks!')
      setName(null)
      setEmail(null)
      setMessage(null)
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
      toast('Submitted. Thanks!')
      setName(null)
      setEmail(null)
      setMessage(null)
    } else {
      toast('Something went wrong. Please try again.')
    }
  }

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 py-10 ">
        <div className="flex flex-col max-w-xl w-full">
          <H1 className="md:max-w-none max-w-xs mb-4">Contribute or contact us</H1>

          <Tabs defaultValue="contact" className="mt-4 w-full justify-center items-center max-w-xl">
            <TabsList className="gap-4 flex flex-row  md:items-center justify-start">
              <TabsTrigger value="contact" onClick={() => setTabValue('contact')}>
                Contact us
              </TabsTrigger>
              <TabsTrigger value="existing_item" onClick={() => setTabValue('existing_item')}>
                Item update
              </TabsTrigger>
              <TabsTrigger value="new_item" onClick={() => setTabValue('new_item')}>
                New item
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
              <Muted className="mb-4 text-left">
                Send us a message and we will get back to you as soon as possible
              </Muted>
              <div className="flex flex-col gap-4">
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
              </div>
            </TabsContent>

            <TabsContent value="existing_item">
              <Muted className="mb-4 text-left">
                Submit a change request or new data regarding an existing item
              </Muted>
              <div className="flex flex-col gap-4">
                <ItemSelector item={selectedItem} setItem={setSelectedItem} />
                <Textarea
                  placeholder="Message"
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <FileUpload file={attachment} setFile={setAttachment} />
              </div>
            </TabsContent>

            <TabsContent value="new_item">
              <Muted className="mb-4 text-left">Share a new item you want to see</Muted>
              <div className="flex flex-col gap-4">
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
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Button
          variant="default"
          onClick={tabValue !== 'contact' ? handleSubmit : handleSubmitContact}
          className="mt-8 min-w-36 max-w-44"
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </SubpageLayout>
  )
}
