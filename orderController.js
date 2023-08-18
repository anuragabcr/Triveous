const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function placeOrder(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated
    const { products } = req.body;

    const totalAmount = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        totalAmount,
        products: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                description: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while placing the order" });
  }
}

async function getOrderHistory(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated

    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                description: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching order history" });
  }
}

async function getOrderById(req, res) {
  try {
    const { userId } = req.user; // Assuming the user is authenticated
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId),
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                description: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    if (!order || order.userId !== parseInt(userId)) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching order" });
  }
}

module.exports = {
  placeOrder,
  getOrderHistory,
  getOrderById,
};
