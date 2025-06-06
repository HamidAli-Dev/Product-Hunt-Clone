import ActiveProducts from "@/components/active-products.tsx";
import { getActiveProducts } from "@/lib/server-actions";

export default async function Home() {
  const products = await getActiveProducts() || [];
  
  const activeProducts = products.map(product => ({
    ...product,
    commentsLength: product.comments.length,
    upvotesCount: product.upvotes.length,
    upvotesData: product.upvotes.map(upvote => upvote.user.id),
    commentData: product.comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      user: comment.user.name,
      profile: comment.user.image,
      body: comment.body,
      name: comment.user.name.toLowerCase().replace(/\s/g, "_"),
      createdAt: comment.createdAt
    }))
  }));

  console.log("activeProducts", activeProducts);

  return (
    <div className="md:w-3/5 mx-auto py-10 px-6">
      <ActiveProducts activeProducts={activeProducts} />
    </div>
  );
}
