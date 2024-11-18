const cron = require("node-cron");
const Order = require("../models/order");
const Product = require("../models/product");

let task = null;

async function startCronJob() {
  if (task) {
    console.log("Cron job already running");
    return;
  }

  task = cron.schedule("* * * * *", async () => {
    console.log("Cron job started to process pending orders");

    try {
      const pendingOrders = await Order.find({ status: "PENDING" });

      for (const order of pendingOrders) {
        const { products } = order;

        let allProductsProcessed = true;

        for (const product of products) {
          const { name, quantity } = product;
          const productDetails = await Product.findOne({ productName: name });
          console.log(productDetails);

          if (!productDetails || quantity > productDetails.stock) {
            console.log(`Insufficient stock or missing product: ${name}`);
            allProductsProcessed = false;
            break;
          }

          await Product.updateOne(
            { productName: name },
            { $inc: { stock: -quantity } }
          );
        }
        console.log(allProductsProcessed);
        if (allProductsProcessed) {
          console.log(`Updating order ${order.orderId} to SUCCESS`);
          await Order.updateOne(
            { orderId: order.orderId },
            { status: "SUCCESS" }
          );
        } else {
          await Order.updateOne(
            { orderId: order.orderId },
            { status: "FAILED" }
          );
        }
      }

      console.log("Cron job completed for processing orders");
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
}


function stopCronJob() {
  if (task) {
    task.stop();
    task = null;
    console.log('Cron job has stopped');
  }
}


module.exports = { startCronJob, stopCronJob };