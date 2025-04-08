import chalk from "chalk";
import prisma from "../handlers/prisma";
import type Crawler from "../types/Crawler";
import type { Internship } from "@prisma/client";


const arunike: Crawler = {
    name: "Arunike",
    source: "https://raw.githubusercontent.com/arunike/Summer-2025-Internship-List/refs/heads/main/README.md",
    async scrape(): Promise<Internship[]> {

        const response = await fetch(this.source);

        if (response.status != 200) {
            throw new Error(`Failed to fetch from ${this.name}`);
        }

        const text = await response.text();

        const matches = text.matchAll(/\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|/g);

        const internships: Internship[] = [];

        let count = 0;
        let prev = "";

        for (const match of matches) {
            if (count < 2) {
                count += 1;
                continue;
            }
            // Company, Title, Hourly Pay, Location, Status, Date Added, Application Link, Notes

            try {
                if (match[1] != "↳") {
                    prev = match[1];
                }
                const url = match[7].match(/\((.*?)\)/);
                if (!url || url.length < 2) {
                    continue;
                }

                const existingInternship = await prisma.internship.findFirst({
                    where: {
                        url: url[1]
                    }
                });
                if (existingInternship) {

                    if (existingInternship.company == match[1] &&
                        existingInternship.title == match[2] &&
                        existingInternship.salary == match[3] &&
                        existingInternship.location == match[4]) {
                        continue;
                    }

                    const internship = await prisma.internship.update({
                        where: {
                            id: existingInternship.id
                        },
                        data: {
                            company: match[1],
                            title: match[2],
                            salary: match[3],
                            location: match[4],
                            date_posted: new Date(match[6]),
                            url: url[1]
                        }
                    });
                    internships.push(internship);
                    continue;
                }
                if (match[5] == "Closed🔒") {
                    continue;
                }
                const internship = await prisma.internship.create({
                    data: {
                        company: match[1] === "↳" ? prev : match[1],
                        title: match[2],
                        salary: match[3],
                        location: removeHtmlTags(match[4]),
                        url: url[1],
                        date_posted: new Date(match[6])
                    }
                });
                internships.push(internship);
            }
            catch {
                console.log(chalk.red(`[!] Failed to create internship: ${match[1]} - ${match[2]} - ${match[3]} - ${match[4]} - ${match[5]} - ${match[6]} - ${match[7]}`));
                continue;
            }
        }

        return internships;
    }
};

function removeHtmlTags(input: string): string {
    const strippedString = input.replace(/<[^>]*>/g, ' ');

    const result = strippedString.replace(/\s+/g, ' ').trim();

    return result;
}

export default arunike;
