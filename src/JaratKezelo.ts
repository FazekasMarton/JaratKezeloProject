// src/JaratKezelo.ts
export class JaratKezelo {
    private jaratok: Map<string, {
        repterHonnan: string,
        repterHova: string,
        indulas: Date,
        keses: number
    }> = new Map();

    ujJarat(jaratSzam: string, repterHonnan: string, repterHova: string, indulas: Date): void {
        if (this.jaratok.has(jaratSzam) || jaratSzam == null || jaratSzam == undefined || jaratSzam == "") {
            throw new Error('A járatszámnak egyedinek kell lennie!');
        }

        this.jaratok.set(jaratSzam, {
            repterHonnan,
            repterHova,
            indulas,
            keses: 0
        });
    }

    keses(jaratSzam: string, keses: number): void {
        const jarat = this.jaratok.get(jaratSzam);
        if (!jarat) {
            throw new Error('Nem létező járat!');
        }

        jarat.keses += keses;
        if (jarat.keses < 0) {
            throw new Error('A késés összértéke nem lehet negatív!');
        }
    }

    mikorIndul(jaratSzam: string): Date {
        const jarat = this.jaratok.get(jaratSzam);
        if (!jarat) {
            throw new Error('Nem létező járat!');
        }

        const indulas = new Date(jarat.indulas.getTime());
        indulas.setMinutes(indulas.getMinutes() + jarat.keses);
        return indulas;
    }

    jaratokRepuloterrol(repter: string): string[] {
        if (repter == "" || repter == null || repter == undefined) {
            throw new Error('A reptér kódja nem lehet üres!');
        }
        const jaratok = [];
        for (const [jaratSzam, jarat] of this.jaratok.entries()) {
            if (jarat.repterHonnan === repter) {
                jaratok.push(jaratSzam);
            }
        }
        return jaratok;
    }
}