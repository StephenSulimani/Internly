export default interface Crawler {
    name: string;
    source: string;
    scrape(): Promise<void>;
};
