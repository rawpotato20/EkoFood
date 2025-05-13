import Box from "@/models/Box";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    const { id, id2, id3, price, volume, out_of_stock, user_id } = req.body;
    try {
      let discount = 0;

      const settings = await Setting.findOne();

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Vartotojas nerastas",
        });
      }

      const userCreatedAt = new Date(user.created_at);
      const today = new Date();
      const twentyFourHoursAfterCreation = new Date(
        userCreatedAt.getTime() + 24 * 60 * 60 * 1000
      );

      if (today > twentyFourHoursAfterCreation) {
        return res.status(400).json({
          success: false,
          message: "Nemokamo produkto laikotarpis baigėsi.",
        });
      }

      if (user.free_product_activated) {
        return res.status(400).json({
          success: false,
          message: "Nemokamas produktas jau buvo aktyvuotas.",
        });
      }

      const cart = await Cart.findById(user.cart_id);
      if (!cart) {
        return res.status(400).json({
          success: false,
          message: "Cart not found",
        });
      }

      const product = await Product.findById(id3);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      let products = cart.products || [];
      const existingFreeProducts = products.filter((p) => p.is_free_product);
      if (existingFreeProducts.length > 0) {
        return res.status(400).json({
          success: false,
          error_type: "free_product_used",
          message: "Nemokamas produktas jau buvo panaudotas.",
        });
      }

      const existingProductIndex = products.findIndex(
        (p) => p.product_id.toString() === id3.toString()
      );
      
      if (existingProductIndex > -1 && products[existingProductIndex].is_free_product) {
        return res.status(400).json({
          success: false,
          error_type: "product_already_free",
          message: "Šis produktas jau yra nemokamas krepšelyje.",
        });
      }

      const normalProductsTotal = products
        .filter((p) => !p.is_free_product)
        .reduce((total, p) => total + Number(p.price) * Number(p.quantity), 0);

      const existingFreeProductsTotal = products
        .filter((p) => p.is_free_product)
        .reduce((total, p) => total + Number(p.price) * Number(p.quantity), 0);

      const newFreeProductsTotal = existingFreeProductsTotal + Number(price);

      if (newFreeProductsTotal > normalProductsTotal) {
        return res.status(400).json({
          success: false,
          message:
            "Nemokamų produktų bendra suma negali viršyti apmokestintų produktų sumos.",
        });
      }

      // Add new free product
      products.push({
        product_id: id3,
        quantity: 1,
        price: Number(price),
        volume: volume,
        out_of_stock: out_of_stock,
        is_free_product: true,
      });

      const quantity = cart.quantity || 0;
      const original_price = cart.original_price || 0;
      const final_price = cart.final_price || 0;
      const saved = cart.saved || 0;

      const newQuantity = quantity + 1;
      const newOriginalPrice = original_price + Number(price);
      let shipping = cart.shipping_fee || 0;
      let newFinalPrice = final_price + Number(price);
      if (newQuantity == 1 && cart.delivery_provider) {
        shipping = Number(
          settings.shipping_fees[cart.delivery_provider][cart.delivery_choice]
        );
        newFinalPrice += shipping;
      } else if (newQuantity === 0) {
        shipping = 0;
        newFinalPrice = 0;
      }
      if (newFinalPrice - shipping >= settings.shipping_bracket) {
        newFinalPrice -= shipping;
        shipping = 0;
      }

      const newSaved = saved + (Number(price) - Number(price));

      const updatedCart = await Cart.findByIdAndUpdate(
        user.cart_id,
        {
          quantity: newQuantity,
          // original_price: newOriginalPrice,
          // final_price: newFinalPrice,
          // shipping_fee: shipping,
          saved: newSaved,
          products,
        },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(400).json({
          success: false,
          message: "Failed to update the cart",
        });
      }

      await User.findByIdAndUpdate(
        id,
        { free_product_activated: true },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Nemokamas produktas pridėtas",
        cart: updatedCart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  } else if (req.method === "DELETE") {
    const { id, id2, id3, price, volume } = req.body;
    try {
      const cart = await Cart.findById(id);
      if (!cart) {
        return res.status(400).json({
          success: false,
          message: "Krepšelis nerastas",
        });
      }

      let products = cart.products || [];

      const existingFreeProductIndex = products.findIndex(
        (p) => p.product_id.toString() === id3.toString() && 
               p.volume === volume && 
               p.is_free_product
      );

      if (existingFreeProductIndex === -1) {
        return res.status(400).json({
          success: false,
          message: "Nemokamas produktas nerastas",
        });
      }

      // Remove the free product
      const freeProduct = products[existingFreeProductIndex];
      products.splice(existingFreeProductIndex, 1);

      // Recalculate cart quantities
      const quantity = cart.quantity || 0;
      const newQuantity = quantity - 1;

      const updatedCart = await Cart.findByIdAndUpdate(
        id,
        {
          $set: {
            products,
            quantity: newQuantity,
          },
          $unset: {
            free_product_activated: 1
          }
        },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(400).json({
          success: false,
          message: "Nepavyko atnaujinti krepšelio",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Nemokamas produktas pašalintas",
        cart: updatedCart,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Vidinė serverio klaida",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Metodas neleidžiamas",
    });
  }
};

export default dbConnect(handler);
