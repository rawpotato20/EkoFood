import Image from "next/image";

export interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface ViewOrderProps {
  data: Product[];
}

const ViewOrder = ({ data }: ViewOrderProps) => {
  return (
    <>
      <div className="container mx-auto h-[80vh] overflow-y-scroll">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="image">Products: </label>
            <div className="flex justify-between bg-black/70 text-white rounded-xl py-2 px-7">
              <div className="w-1/6">Image</div>
              <div className="w-1/6">Name</div>
              <div className="w-1/6">Price</div>
            </div>
            <div className="h-[60vh] overflow-y-scroll">
              {data.length
                ? data.map((product: Product) => (
                    <div
                      key={product._id}
                      className="flex justify-between items-center py-2 px-7 border border-white rounded-xl"
                    >
                      <div className="w-1/6">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] object-contain"
                        />
                      </div>
                      <div className="w-1/6">
                        {product.name ? product.name : ""}
                      </div>
                      <div className="w-1/6">
                        {product.price ? product.price : ""}
                      </div>
                    </div>
                  ))
                : "None"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrder;
