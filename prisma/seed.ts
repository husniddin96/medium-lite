import { PrismaClient, UserRole } from "@prisma/client";

new PrismaClient().user.create({
    data: {
        name: 'John Doe',
        email: 'jdoe@mail.com',
        password: '$2a$10$VgGs2ZkN8y0P/uzCXGD8neKIjD9/xUU0OdHkcoHQLy.0ZR.U.7a5C',
        role: UserRole.ADMIN
    }
}).then((data) => console.log({data}))

// email: jdoe@mail.com
// password: pass123