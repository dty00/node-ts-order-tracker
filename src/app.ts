import{promises as fs} from "node:fs";

// const data = fs.readFile("example.txt","utf8");
// console.log("文件内容：", data);
// // console.log(process.cwd());

const filePath = "orderTrackLog.txt";

type OrderStatus = "delivered" | "failed";

interface Order {
    customerName:string;
    date:string;
    status:OrderStatus;
}

const addOrder = (order : Order) => {
    const line=
    `${order.customerName},${order.date},${order.status}\n`;
    return fs.appendFile(filePath, line, "utf8");
}

const readOrders = () => fs.readFile(filePath, "utf8");

const run = async () => {
    await addOrder({
        customerName:"Bob",
        date:"01/07/2026",
        status:"delivered"
    });

    await addOrder({
        customerName:"Ash",
        date:"02/07/2026",
        status:"failed"
    });

    const content = await readOrders();
    console.log(content);

    await fs.unlink(filePath);
    console.log("file deleted");

}

run().catch(console.error);
