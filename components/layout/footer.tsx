import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Image
            src="/web-logo.png"
            alt="Pariwat Property"
            width={108}
            height={108}
            className="w-32 h-32 object-contain"
            // unoptimized
          />
          {/* <span className="text-xl font-bold text-white">
            Pariwat Property
          </span> */}
        </div>
        <p className="mb-2 text-sm">
          Premium Real Estate Solutions | Chachoengsao, Thailand
        </p>
        <p className="text-xs">
          © 2025 บริษัท บุญเกตุ แอสเซท กรุ๊ป จำกัด. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
