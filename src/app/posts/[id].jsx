'use client'

import { ArrowLeftIcon } from "@heroicons/react/outline";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../firebase";

import { AnimatePresence, motion } from "framer-motion";
import Comment from "../../../components/Comment";
import Sidebar from "../../../components/Sidebar";
import Post from "../../../components/Post";
import Widgets from "../../../components/Widgets";
import CommentModal from "../../../components/CommentModal";

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

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const [newsResults, setNewsResults] = useState();
  const [randomUsersResults, setRandomUsersResults] = useState();

  // Fetch news and users data
  useEffect(() => {
    async function fetchData() {
      const newsData = await fetchNews();
      setNewsResults(newsData);
      const usersData = await fetchUsers();
      setRandomUsersResults(usersData);
    }
    fetchData();
  }, []);

  // get the post data

  useEffect(
    () => onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot)),
    [id]
  );

  // get comments of the post

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [id]);

  return (
    <>
      <main className="flex min-h-screen mx-auto">
        {/* Sidebar */}
        <Sidebar />

        {/* Feed */}

        <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
          <div className="flex items-center space-x-2  py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Tweet
            </h2>
          </div>

          <Post id={id} post={post} />
          {comments.length > 0 && (
            <div className="">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Comment
                      key={comment.id}
                      commentId={comment.id}
                      originalPostId={id}
                      comment={comment.data()}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Widgets */}

        <Widgets
          newsResults={newsResults.articles}
          randomUsersResults={randomUsersResults.results}
        />

        {/* Modal */}

        <CommentModal />
      </main>
    </>
  );
}
