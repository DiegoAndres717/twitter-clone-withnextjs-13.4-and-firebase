import CommentModal from '../../components/CommentModal'
import Feed from '../../components/Feed'
import Sidebar from '../../components/Sidebar'
import Widgets from '../../components/Widgets'
import './globals.css'

async function fetchNews() {
  const res = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/in.json', { cache: 'no-cache'})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?results=30&inc=name,login,picture', { cache: 'no-cache'})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home() {
  const NewResults = await fetchNews();
  const newUsers = await fetchUsers();

  return (
    <main className='flex min-h-screen mx-auto'>
      <Sidebar/>
      <Feed />
      <Widgets newsResults={NewResults.articles} randomUsersResults={newUsers.results}/>
      <CommentModal />
    </main>
  )
}
