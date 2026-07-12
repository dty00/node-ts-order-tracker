import{promises as fs} from "node:fs";
import http, { IncomingMessage, ServerResponse } from "node:http";


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

    // await fs.unlink(filePath);
    // console.log("file deleted");

}

const PORT = 3000;

const server = http.createServer(
    async (req: IncomingMessage, res:ServerResponse)=> {
        res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.url === "/api/home" && req.method === "GET"){
        res.statusCode = 200;

        res.end(
            JSON.stringify({
                message:"Welcome to the Home API",
            }),
        );
    } else if (req.url ==="/api/about" && req.method === "GET"){
        res.statusCode = 200;

        res.end(JSON.stringify({
            message:'This is the About API',
        }),
    );
    } else if (req.url ==="/api/orders" && req.method === "GET"){
        try{
            const content = await fs.readFile(filePath, "utf8");
            const orders = content.trim().split("\n").map((line) => {const [name, date, status]=line.split(",");
                return {
                    name, date, status,
                };
            });
            res.statusCode = 200;

            res.end(JSON.stringify({
                orders,
        }),
    );
    } catch (error:unknown){
        res.statusCode = 500;
        res.end(
            JSON.stringify({
                error: "Failed to read orders",
            }),
        );
    }

    }else {
    
        res.statusCode = 404;
        res.end(JSON.stringify({error:'Not Found'}));
    }

    
    }
);

server.listen(PORT, ()=> {
    console.log(`API server running at http://localhost:${PORT}`);
})




run().catch(console.error);
