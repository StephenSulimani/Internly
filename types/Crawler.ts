import type { Internship } from "@prisma/client";

export default interface Crawler {
    name: string;
    source: string;
    scrape(): Promise<Internship[]>;
};
