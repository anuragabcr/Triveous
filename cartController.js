const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    const cartItem = await prisma.cart.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      },
    });

    return res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding to cart" });
  }
}

async function getCart(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated

    const cartItems = await prisma.cart.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
          },
        },
      },
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching cart items" });
  }
}

async function updateCartItem(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const updatedCartItem = await prisma.cart.update({
      where: {
        id: parseInt(cartItemId),
      },
      data: {
        quantity: parseInt(quantity),
      },
    });

    return res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating cart item" });
  }
}

async function removeCartItem(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated
    const { cartItemId } = req.params;

    await prisma.cart.delete({
      where: {
        id: parseInt(cartItemId),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while removing cart item" });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
