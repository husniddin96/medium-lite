import { Resolver, Query } from "@nestjs/graphql";

@Resolver('Query')
export class AppResolver {
    @Query(() => String)
    hello() {
        return 'Hello World!';
    }
}
