import axios from 'axios'

export const fetchMarkdown = async (url: string): Promise<string> => {
  const response = await axios.get(url)
  return response.data
} 