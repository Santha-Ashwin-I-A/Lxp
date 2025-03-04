const{ PrismaClient } =require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Developement"},
                {name: "Designing"},
                {name: "Data Science"},
                {name: "Machine Learning"},
                {name: "Deep Learning"},
                {name: "Engineering"},
            ]
        });
        console.log("success");
    } catch (error) {
        console.log("Error seeding",error)
    }
    finally{
        await database.$disconnect();
    }
}

main();