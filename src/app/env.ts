const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_ENDPOINT),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    apikey: String(process.env.APP_WRITE_API_KEY)
  }
}

export default env