import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 text-center">Welcome to NexStore</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl text-center">
        The premium destination for all your shopping needs. Discover our exclusive collection today.
      </p>
      <Link href="/products" className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-xl text-lg">
        Shop Now
      </Link>
    </div>
  );
}
