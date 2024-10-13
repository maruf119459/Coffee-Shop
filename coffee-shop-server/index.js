const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb'); // Ensure you are importing correctly

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_SECRETKEY}@coffeeshop.vflusdt.mongodb.net/?retryWrites=true&w=majority&appName=coffeeShop`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db("coffee_shop");
    const employeeCollection = database.collection("employee");
    const coffeeCollection = database.collection("coffee");
    const userCollection = database.collection("user");
    const messageCollection = database.collection("message");
    const cartCollection = database.collection("cart");
    const orderCollection = database.collection("order");
    const userNotificationCollection = database.collection("userNotification");
    const employeeNotificationCollection = database.collection("employeeNotification");
    const monthlyCollection = database.collection("monthly");
    const dailyCollection = database.collection("daily");
    const categoryBySellsCollection = database.collection("categoryBySells");


    await employeeCollection.createIndex({ nid: 1 }, { unique: true });
    await employeeCollection.createIndex({ email: 1 }, { unique: true });
    await employeeCollection.createIndex({ employee_id: 1 }, { unique: true });
    await coffeeCollection.createIndex({ name: 1 }, { unique: true });
    await userCollection.createIndex({ email: 1 }, { unique: true });
    // await buyProductCollection.createIndex({ email: 1 }, { unique: true });

    app.get('/employeeCount', async (req, res) => {
      try {
        const count = await employeeCollection.estimatedDocumentCount();
        res.json(count);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employee count' });
      }
    });

    app.post('/employee', async (req, res) => {
      try {
        const employee = req.body;
        const result = await employeeCollection.insertOne(employee);
        res.json(result);
      } catch (error) {
        if (error.code === 11000) { // Duplicate key error code in MongoDB
          const duplicateKey = Object.keys(error.keyPattern)[0];
          const errorMessage = `Duplicate entry for ${duplicateKey}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to add employee' });
        }
      }
    });

    app.put('/employee/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedEmployee = req.body;

        // Find the employee by id and update their information
        const result = await employeeCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedEmployee }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }

        res.send(result);
      } catch (error) {
        if (error.code === 11000) {
          const duplicateKey = Object.keys(error.keyPattern)[0];
          const errorMessage = `Duplicate entry for ${duplicateKey}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to update employee' });
        }
      }
    });
    app.patch('/employee/:employee_id', async (req, res) => {
      try {
        const { employee_id } = req.params;
        const updatedEmployee = req.body;

        // Convert employee_id to an integer
        const employeeIdInt = parseInt(employee_id);

        // Find the employee by id and update their information
        const result = await employeeCollection.updateOne(
          { employee_id: employeeIdInt },
          { $set: updatedEmployee }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
      }
    });





    app.get('/employee', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const totalEmployees = await employeeCollection.countDocuments();
        const result = await employeeCollection.find().skip(skip).limit(limit).toArray();
        res.json({
          totalEmployees,
          totalPages: Math.ceil(totalEmployees / limit),
          currentPage: page,
          employees: result
        });
      }
      catch (error) {
        res.status(500).json({ error: 'Failed to load employee' });
      }
    })



    app.get('/employee/:id', async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await employeeCollection.find(query).toArray();
        res.send(result);
      }
      catch (error) {
        res.status(500).json({ error: 'Failed to load employee' });
      }
    })

    app.get('/employeeByEmail', async (req, res) => {
      const email = req.query.email; // Get the email from the query parameters
      try {
        const user = await employeeCollection.findOne({ email: email });
        if (user) {
          res.status(200).json(user); // Return user data with 200 status
        }
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    });

    app.get('/deliveryMan/:deliveryMan', async (req, res) => {
      const designation = req.params.deliveryMan;
      try {
        const user = await employeeCollection.find({ designation: designation }).toArray();;
        if (user) {
          res.status(200).json(user); // Return user data with 200 status
        }
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    });

    app.delete('/employee/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const result = await employeeCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Employee deleted successfully' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete Employee', error });
      }
    });

    app.delete('/employeesDelete', async (req, res) => {
      const { ids } = req.body;
      try {
        const objectIds = ids.map(id => new ObjectId(id));
        const result = await employeeCollection.deleteMany({ _id: { $in: objectIds } });
        if (result.deletedCount === ids.length) {
          res.status(200).json({ message: 'Employees deleted successfully' });
        } else {
          res.status(404).json({ message: 'Some employees not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete employees', error });
      }
    });

    app.get('/coffeeCount', async (req, res) => {
      try {
        const count = await coffeeCollection.estimatedDocumentCount();
        res.json(count);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve coffee count' });
      }
    });


    app.post('/coffee', async (req, res) => {
      try {
        const coffee = req.body;
        const result = await coffeeCollection.insertOne(coffee);
        res.json(result);
      }
      catch (error) {
        if (error.code === 11000) { // Duplicate key error code in MongoDB
          const duplicateKey = Object.keys(error.keyPattern)[0];
          const errorMessage = `Duplicate entry for ${duplicateKey}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to add coffee' });
        }
      }
    })

    app.get('/coffee', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const totalCoffees = await coffeeCollection.countDocuments();
        const result = await coffeeCollection.find().skip(skip).limit(limit).toArray();

        res.json({
          totalCoffees,
          totalPages: Math.ceil(totalCoffees / limit),
          currentPage: page,
          coffees: result
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });

    app.get('/coffee/:id', async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const coffee = await coffeeCollection.findOne(query);
        if (!coffee) {
          return res.status(404).json({ error: 'Coffee not found' });
        }
        res.send(coffee);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });

    app.put('/coffee/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedCoffee = req.body;
        const result = await coffeeCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedCoffee }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Coffee not found' });
        }

        res.json({ message: 'Coffee updated successfully', result });
      } catch (error) {
        if (error.code === 11000) {
          const duplicateKey = Object.keys(error.keyPattern)[0];
          const errorMessage = `Duplicate entry for ${duplicateKey}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to update coffee' });
        }
      }
    });

    app.patch('/coffee/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedCoffee = req.body;
        const result = await coffeeCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedCoffee }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Coffee not found' });
        }

        res.json({ message: 'Coffee updated successfully', result });
      } catch (error) {
        if (error.code === 11000) {
          const duplicateKey = Object.keys(error.keyPattern)[0];
          const errorMessage = `Duplicate entry for ${duplicateKey}`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to update coffee' });
        }
      }
    });

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Coffee deleted successfully' });
        } else {
          res.status(404).json({ message: 'Coffee not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete coffee', error });
      }
    });




    app.get('/coffee/category/:category', async (req, res) => {
      const category = req.params.category;
      try {
        const coffees = await coffeeCollection.find({ category: category }).toArray();
        if (coffees.length === 0) {
          res.status(404).json({ error: 'No coffees found in this category' });
        } else {
          res.json(coffees);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffees' });
      }
    });

    app.get('/topTenCoffee', async (req, res) => {
      try {
        const result = await coffeeCollection.find().sort({ rating: -1 }).limit(10).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });

    app.get('/topTenSellsCoffee', async (req, res) => {
      try {
        const result = await coffeeCollection.find().sort({ sellsAmount: -1 }).limit(10).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });

    app.get('/topTenSellsCoffee', async (req, res) => {
      try {
        const result = await coffeeCollection.find({ projection: { name: 1, sellsAmount: 1, _id: 1 } })
          .sort({ sellsAmount: -1 })
          .limit(10)
          .toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });


    app.post('/user', async (req, res) => {
      try {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.json(result);
      } catch (error) {
        if (error.code === 11000) { // Duplicate key error code in MongoDB
          const errorMessage = `This email already used`;
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(500).json({ error: 'Failed to complete registration. Try again' });
        }
      }
    });

    app.patch('/user/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: req.body,
      };
      try {
        const result = await userCollection.updateOne(query, updateDoc);
        res.status(200).send({ result });
      } catch (error) {
        res.status(400).send(error);
      }
    });


    app.get('/userByEmail', async (req, res) => {

      const email = req.query.email; // Get the email from the query parameters
      try {
        const user = await userCollection.findOne({ email: email });
        if (user) {
          res.status(200).json(user); // Return user data with 200 status
        }
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    });

    app.get('/users/count', async (req, res) => {
      try {
        const userCount = await userCollection.countDocuments();
        res.json({ count: userCount });
      } catch (error) {
        console.error('Error fetching user count', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'user deleted successfully' });
        } else {
          res.status(404).json({ message: 'user not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
      }
    });


    app.get('/collectDataBothEmployeeAndUserByEmail', async (req, res) => {
      const email = req.query.email; // Get the email from the query parameters
      try {
        const user1 = await employeeCollection.findOne({ email: email });
        const user2 = await userCollection.findOne({ email: email });

        if (user1 && user2) {
          const mergedUser = { ...user1, ...user2 }; // Merge user1 and user2
          res.status(200).json(mergedUser); // Return merged user data with 200 status
        } else {
          res.status(404).json({ message: 'Employee not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    });

    app.post('/message', async (req, res) => {
      try {
        const message = req.body;
        const result = await messageCollection.insertOne(message);
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    })

    app.get('/message', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const totalMessages = await messageCollection.countDocuments();
        const result = await messageCollection.find().skip(skip).limit(limit).sort({ _id: -1 }).toArray();
        res.json({
          totalMessages,
          totalPages: Math.ceil(totalMessages / limit),
          currentPage: page,
          messages: result
        });
      }
      catch (error) {
        res.status(500).json({ error: 'Failed to load message' });
      }
    })

    app.get('/message/:id', async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const message = await messageCollection.findOne(query);
        if (!message) {
          return res.status(404).json({ error: 'message not found' });
        }
        res.send(message);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load message' });
      }
    });

    app.patch('/message/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: req.body,
      };
      try {
        const result = await messageCollection.updateOne(query, updateDoc);
        res.status(200).send({ result });
      } catch (error) {
        res.status(400).send(error);
      }
    });

    app.get('/messages/unread-count', async (req, res) => {
      try {
        const unreadCount = await messageCollection.countDocuments({ status: 'unread' });
        res.json({ unreadCount });
      } catch (error) {
        res.status(500).json({ error: 'Failed to count unread messages' });
      }
    });

    app.get('/buyCoffees/:id', async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const coffee = await coffeeCollection.findOne(query);
        if (!coffee) {
          return res.status(404).json({ error: 'Coffee not found' });
        }
        res.status(200).json([coffee]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });



    app.get('/cart/selectedProducts/:email', async (req, res) => {
      try {
        const { email } = req.params;
        const { productIds } = req.query;

        if (!productIds || productIds.length === 0) {
          return res.status(400).json({ message: "No product IDs provided" });
        }

        const productIdsArray = Array.isArray(productIds) ? productIds : [productIds];
        const products = await cartCollection.find({
          customerEmail: email,
          coffeeId: { $in: productIdsArray }
        }).toArray();

        res.json(products);
      } catch (error) {
        console.error('Error fetching selected products:', error);
        res.status(500).json({ message: "Internal server error" });
      }
    });




    app.get('/cart/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const cartItems = await cartCollection.find({ customerEmail: email }).toArray();
        res.status(200).json(cartItems);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Add/update cart item
    app.post('/cart', async (req, res) => {
      const { coffeeId, customerEmail, quantity, coffeeName, coffeeImageUrl, coffeeSellPrice } = req.body;
      try {
        const existingCartItem = await cartCollection.findOne({ coffeeId, customerEmail });
        if (existingCartItem) {
          await cartCollection.updateOne(
            { _id: existingCartItem._id },
            { $set: { quantity: existingCartItem.quantity + quantity } }
          );
        } else {
          await cartCollection.insertOne({ coffeeId, customerEmail, quantity, coffeeName, coffeeImageUrl, coffeeSellPrice });
        }
        res.status(200).send('Cart updated');
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.patch('/cart/:email/:productId', async (req, res) => {
      const { email, productId } = req.params;
      const { quantity } = req.body;

      try {
        const filter = { customerEmail: email, coffeeId: productId };
        const updateDoc = {
          $set: { quantity: quantity }
        };
        const result = await cartCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: 'Cart item updated successfully' });
        } else {
          res.status(404).json({ message: 'Cart item not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to update cart item', error });
      }
    });

    // Delete cart item by user email and product ID
    app.delete('/cart/:email/:productId', async (req, res) => {
      const { email, productId } = req.params;
      try {
        await cartCollection.deleteOne({ coffeeId: productId, customerEmail: email });
        res.status(200).send('Cart item deleted');
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete('/cart/:email', async (req, res) => {
      const { email } = req.params;
      const { productIds } = req.body; // Array of product IDs to delete
      try {
        const result = await cartCollection.deleteMany({
          customerEmail: email,
          coffeeId: { $in: productIds }
        });
        res.status(200).json({ message: 'Cart items deleted successfully', deletedCount: result.deletedCount });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete cart items', error });
      }
    });

    app.get('/cart/length/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const cartItemsCount = await cartCollection.countDocuments({ customerEmail: email });
        res.status(200).json({ length: cartItemsCount });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart length', error });
      }
    });


    app.get('/orders', async (req, res) => {
      const { page = 1, limit = 5 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      try {
        const totalOrders = await orderCollection.countDocuments();
        const orders = await orderCollection.find()
          .sort({ _id: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        res.status(200).json({
          orders,
          totalPages: Math.ceil(totalOrders / limit),
          currentPage: parseInt(page)
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
      }
    });


    app.post('/order', async (req, res) => {
      try {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.status(201).send(result);
      } catch (error) {
        console.error('Error posting order:', error);
        res.status(500).send('Error posting order');
      }
    });

    app.patch('/order/:orderId/product/:productId/ratingValue', async (req, res) => {
      try {
        const { orderId, productId } = req.params;
        const { ratingValue } = req.body;


        if (typeof ratingValue === 'undefined') {
          return res.status(400).json({ error: 'Rating is required' });
        }

        const result = await orderCollection.updateOne(
          { _id: new ObjectId(orderId), 'buyProduct.coffeeId': productId },
          { $set: { 'buyProduct.$.ratingValue': ratingValue } }
        );


        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Order or product not found' });
        }

        res.status(200).json({ message: 'Rating updated successfully' });
      } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).send('Error updating rating');
      }
    })

    app.patch('/order/:orderId', async (req, res) => {
      try {
        const { orderId } = req.params;
        const updateData = req.body;
        const result = await orderCollection.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: updateData }
        );
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully' });
      } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Error updating order');
      }
    });


    app.get('/orders/count/:status', async (req, res) => {
      const { status } = req.params;
      try {
        const count = await orderCollection.countDocuments({ orderStatus: status });
        res.status(200).json({ count });
      } catch (error) {
        console.error('Error counting orders:', error);
        res.status(500).send('Error counting orders');
      }
    });
    app.get('/orders/count/:status/:date', async (req, res) => {
      const { status } = req.params;
      const { date } = req.params;
      try {
        const count = await orderCollection.countDocuments({ orderStatus: status, date: date });
        res.status(200).json({ count });
      } catch (error) {
        console.error('Error counting orders:', error);
        res.status(500).send('Error counting orders');
      }
    });

    app.get('/orders/:email', async (req, res) => {
      const { email } = req.params;
      const { page = 1, limit = 5 } = req.query;

      try {
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalOrders = await orderCollection.countDocuments({ email: email });
        const orders = await orderCollection.find({ email: email })
          .sort({ _id: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        res.status(200).json({
          orders,
          totalPages: Math.ceil(totalOrders / limit),
          currentPage: parseInt(page)
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
      }
    });

    app.get('/orders/:email/:status', async (req, res) => {
      const { email } = req.params;
      const { status } = req.params;
      try {
        const orders = await orderCollection.find({ email: email, orderStatus: status }).toArray();
        res.status(200).json(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
      }
    });

    app.get('/history/:email/:status', async (req, res) => {
      const { email, status } = req.params;
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        // Find total count of documents matching the query
        const totalMessages = await orderCollection.countDocuments({ email: email, orderStatus: status });

        // Get paginated results
        const orders = await orderCollection.find({ email: email, orderStatus: status }).skip(skip).limit(limit).toArray();

        res.json({
          totalPages: Math.ceil(totalMessages / limit),
          currentPage: page,
          orders: orders
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
      }
    });



    app.get('/order/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const order = await orderCollection.findOne({ _id: new ObjectId(id) });
        if (order) {
          res.status(200).json(order);
        } else {
          res.status(404).send('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Error fetching order');
      }
    });


    app.post('/userNotification', async (req, res) => {

      try {
        const userNotification = req.body;
        const result = await userNotificationCollection.insertOne(userNotification);
        res.status(200).json({ message: 'Inserted' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    })

    app.patch('/userNotification/:id', async (req, res) => {
      const { id } = req.params;
      const updateNotification = req.body;
      try {
        const result = await userNotificationCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateNotification });
        res.status(200).json({ message: 'Updated' });

      }
      catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }

    })

    app.get('/userNotification/:email', async (req, res) => {
      const { email } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      try {
        const totalOrders = await userNotificationCollection.countDocuments({ email: email });
        const notifications = await userNotificationCollection.find({ email: email })
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.status(200).json({
          notifications,
          totalPages: Math.ceil(totalOrders / limit),
          currentPage: page
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.get('/userNotificationGetById/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const result = await userNotificationCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get('/unreadUserNotification/unread/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const unreadCount = await userNotificationCollection.countDocuments({
          email: email,
          notificationStatus: 'unread'
        });
        res.status(200).json(unreadCount);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    app.get('/unreadEmployeeNotification/unread/:employee_id', async (req, res) => {
      const { employee_id } = req.params;
      const employeeIdInt = parseInt(employee_id);

      try {
        const unreadCount = await employeeNotificationCollection.countDocuments({
          employeeId: employeeIdInt,
          notificationStatus: 'unread'
        });
        res.status(200).json(unreadCount);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });



    app.post('/employeeNotification', async (req, res) => {
      try {
        const employeeNotification = req.body;
        const result = await employeeNotificationCollection.insertOne(employeeNotification);
        res.status(200).json({ message: 'Inserted' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    })

    app.get('/employeeNotification/:employee_id', async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      try {
        const { employee_id } = req.params;
        const employeeIdInt = parseInt(employee_id);

        const query = { employeeId: employeeIdInt };
        const totalOrders = await employeeNotificationCollection.countDocuments(query);
        const notifications = await employeeNotificationCollection.find(query).sort({ _id: -1 }).skip(skip).limit(limit).toArray();

        res.status(200).json({
          notifications,
          totalPages: Math.ceil(totalOrders / limit),
          currentPage: page
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to load employee notifications' });
      }
    });


    app.patch('/employeeNotification/:id', async (req, res) => {
      const { id } = req.params;
      const updateNotification = req.body;
      try {
        const result = await employeeNotificationCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateNotification });
        res.status(200).json({ message: 'Updated' });

      }
      catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }

    })

    app.get('/employeeNotificationGetById/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const result = await employeeNotificationCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    app.get('/employeeNotificationGetById/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const result = await employeeNotificationCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get('/findDate/:date', async (req, res) => {
      const { date } = req.params;
      try {
        const result = await dailyCollection.findOne({ date: date });
        if (result) {
          res.json({ message: 'Date found' });
        } else {
          res.json({ message: 'Date not found' });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post('/sellsCoffees', async (req, res) => {
      const { date, coffee } = req.body;
      if (!date || !coffee || !coffee.coffeeId) {
        return res.status(400).json({ error: 'Missing date or coffee details' });
      }
      try {
        const result = await dailyCollection.updateOne(
          { date: date },
          { $push: { sellsCoffees: coffee } },
          { upsert: true }
        );
        res.status(201).json({ message: 'Coffee added successfully', result });
      } catch (err) {
        console.error('Error adding coffee', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.patch('/sellsCoffees', async (req, res) => {
      const { date, coffee } = req.body;
      if (!date || !coffee || !coffee.coffeeId) {
        return res.status(400).json({ error: 'Missing date or coffee details' });
      }
      try {
        const result = await dailyCollection.updateOne(
          { date: date, 'sellsCoffees.coffeeId': coffee.coffeeId },
          { $set: { 'sellsCoffees.$': coffee } }
        );

        res.status(200).json({ message: 'Coffee updated successfully', result });
      } catch (err) {
        console.error('Error updating coffee', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/sellsQuantity/:coffeeId/:date', async (req, res) => {
      const { coffeeId, date } = req.params;
      if (!coffeeId || !date) {
        return res.status(400).json({ error: 'Missing coffeeId or date parameter' });
      }
      try {
        const result = await dailyCollection.findOne(
          { date: date },
          { projection: { sellsCoffees: { $elemMatch: { coffeeId: coffeeId } } } }
        );
        if (result) {
          const sellsQuantity = result.sellsCoffees?.[0]?.sellsQuantity || 0;
          return res.json({ sellsQuantity });
        } else {
          return res.json({ error: 'Date not found' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/dailySells', async (req, res) => {
      try {
        const dailySells = req.body;
        const result = await dailyCollection.insertOne(dailySells);
        res.status(200).json({ message: 'Inserted', result });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    });


    app.get('/dailySells', async (req, res) => {
      try {
        const dailySells = await dailyCollection.find().sort({ _id: -1 }).toArray();
        res.status(200).json(dailySells);
      } catch (error) {
        console.error('Error fetching dailySells:', error);
        res.status(500).send('Error fetching dailySells');
      }
    });

    app.get('/dailySells/:date', async (req, res) => {
      const { date } = req.params;
      // console.log(date)
      try {
        const result = await dailyCollection.findOne({ date: date });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.get('/dailySells/:date', async (req, res) => {
      const { date } = req.params;
      // console.log(date)
      try {
        const result = await dailyCollection.findOne({ date: date });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get('/findMonth/:month', async (req, res) => {
      const { month } = req.params;
      try {
        const result = await monthlyCollection.findOne({ month: month });
        if (result) {
          res.json({ message: 'Month found', result });
        } else {
          res.json({ message: 'Month not found' });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });



    app.post('/monthlySells', async (req, res) => {
      try {
        const monthlySells = req.body;
        const result = await monthlyCollection.insertOne(monthlySells);
        res.status(200).json({ message: 'Inserted', result });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
      }
    });


    app.get('/monthlySellsFindDate/:date', async (req, res) => {
      const { date } = req.params;
      if (!date) {
        return res.status(400).json({ error: 'Missing date parameter' });
      }
      try {
        const result = await monthlyCollection.findOne(
          { "dailySells.date": date },
          { projection: { dailySells: { $elemMatch: { date: date } } } }
        );
        if (result && result.dailySells && result.dailySells.length > 0) {
          res.json({ message: 'Date found', result: result.dailySells[0] });
        } else {
          res.json({ message: 'Date not found' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });



    app.post('/monthlySellsDailyReport', async (req, res) => {
      const { month, dailySells } = req.body;
      if (!month || !dailySells) {
        return res.status(400).json({ error: 'Missing month or dailySells' });
      }
      try {
        const result = await monthlyCollection.updateOne(
          { month: month },
          { $push: { dailySells: dailySells } },
          { upsert: true }
        );
        res.status(201).json({ message: 'dailySells added successfully', result });
      } catch (err) {
        console.error('Error adding dailySells', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    app.patch('/monthlySellsDailyReport', async (req, res) => {
      const { month, date, dailySells } = req.body;
      if (!month || !date || !dailySells) {
        return res.status(400).json({ error: 'Missing month, date or dailySells' });
      }
      try {
        const result = await monthlyCollection.updateOne(
          { month: month, 'dailySells.date': date },
          { $set: { 'dailySells.$': dailySells } }
        );
        res.status(200).json({ message: 'dailySells updated successfully', result });
      } catch (err) {
        console.error('Error updating dailySells', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });




    app.get('/monthlySells/:month', async (req, res) => {
      const { month } = req.params;
      try {
        const result = await monthlyCollection.findOne({ month: month });
        res.status(200).json(result);

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get('/monthlySells', async (req, res) => {
      try {
        const result = await monthlyCollection.find().toArray();
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.get('/unique-years', async (req, res) => {
      try {

        const uniqueYears = await monthlyCollection.aggregate([
          {
            $group: {
              _id: "$year"  // Group by the 'year' field
            }
          },
          {
            $project: {
              _id: 0,  // Exclude the _id field from the results
              year: "$_id"  // Rename the field '_id' to 'year'
            }
          }
        ]).toArray();

        res.json(uniqueYears);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    })


    app.get('/yearlySells/:year', async (req, res) => {
      const { year } = req.params;
      try {
        const result = await monthlyCollection.find({ year: year }).toArray();
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.get('/categoryBySells', async (req, res) => {
      try {
        const result = await categoryBySellsCollection.find().toArray();
        if (result) {
          res.json(result);
        } else {
          res.status(404).json({ error: 'No data found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
      }
    });

    app.patch('/categoryBySells/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      try {
        const result = await categoryBySellsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.modifiedCount > 0) {
          res.json({ message: 'Data updated successfully' });
        } else {
          res.status(404).json({ error: 'Data not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
      }
    });


    app.get('/getDataBetweenDates', async (req, res) => {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Please provide both startDate and endDate' });
      }

      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure the end date is inclusive by setting it to the end of the day
        end.setHours(23, 59, 59, 999);

        const result = await dailyCollection.find({
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
      }
    });

    app.get('/coffeeSearch', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const searchRegex = new RegExp(searchQuery, 'i');

        const filter = {
          $or: [
            { category: searchRegex },
            { details: searchRegex },
            { name: searchRegex }
          ]
        };

        const totalCoffees = await coffeeCollection.countDocuments(filter);
        const result = await coffeeCollection.find(filter).skip(skip).limit(limit).toArray();

        res.json({
          totalCoffees,
          totalPages: Math.ceil(totalCoffees / limit),
          currentPage: page,
          coffees: result
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to load coffee' });
      }
    });






    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }


}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
