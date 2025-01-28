import { motion } from "motion/react";
import Header from "../components/common/Header";
// Mock data for posts
const posts = [
  {
    id: 1,
    imageUrl:
      "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY436_FMwebp_QL65_.jpg",
    caption: "Beautiful sunset",
    author: "John Doe",
  },
  {
    id: 2,
    imageUrl:
      "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY436_FMwebp_QL65_.jpg",
    caption: "Delicious meal",
    author: "Jane Smith",
  },
  {
    id: 3,
    imageUrl:
      "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY436_FMwebp_QL65_.jpg",
    caption: "Amazing view from the mountain top",
    author: "Mike Johnson",
  },
  {
    id: 4,
    imageUrl:
      "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY436_FMwebp_QL65_.jpg",
    caption: "Delicious meal",
    author: "Jane Smith",
  },
  {
    id: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/61opqQEBUxL._AC_UY436_FMwebp_QL65_.jpg",
    caption: "Amazing view from the mountain top",
    author: "Mike Johnson",
  },
];

export default function HomePage() {
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Home" />
        <div className="container mx-auto px-10 py-5">
          <h1 className="text-3xl font-bold mb-8">Your Feed</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className=" rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.caption}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-white mb-2">{post.caption}</p>
                  <p className="text-sm text-gray-500">
                    Posted by {post.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
