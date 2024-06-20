export const addUserToAlgolia = async (user: any) => {
  try {
    const objectWithId = {
      ...user,
      type: 'user',
      objectID: user.id,
    }

    const objects = [objectWithId]

    fetch('/api/algolia/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objects: objects, indexName: 'users' }),
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteUserFromAlgolia = async (id: string) => {
  try {
    fetch('/api/algolia/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objectId: id, indexName: 'users' }),
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
