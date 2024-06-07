import { describe, it, expect, beforeEach } from 'vitest';
import { JaratKezelo } from '../src/JaratKezelo';

describe('JaratKezelo', () => {
    let jaratKezelo: JaratKezelo;

    beforeEach(() => {
        jaratKezelo = new JaratKezelo();
    });

    it('új járatot kéne hozzáadnia', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        expect(jaratKezelo['jaratok'].size).toBe(1);
    });

    it('hibaüzenetet kéne dobnija a repülési szám ismétlődése esetén', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        expect(() => {
            jaratKezelo.ujJarat('ASD6969', 'LOS', 'MEL', new Date('2024-06-01T12:00:00Z'));
        }).toThrow('A járatszámnak egyedinek kell lennie!');
    });

    it('késlelteni kéne járatot', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        jaratKezelo.keses('ASD6969', 30);
        expect(jaratKezelo.mikorIndul('ASD6969').toISOString()).toBe('2024-06-01T10:30:00.000Z');
    });

    it('hibát kéne dobnija a negatív késleltetésnél', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        jaratKezelo.keses('ASD6969', 30);
        expect(() => {
            jaratKezelo.keses('ASD6969', -40);
        }).toThrow('A késés összértéke nem lehet negatív!');
    });

    it('vissza kéne adnia a megfelelő indulási időt', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        jaratKezelo.keses('ASD6969', 45);
        expect(jaratKezelo.mikorIndul('ASD6969').toISOString()).toBe('2024-06-01T10:45:00.000Z');
    });

    it('adott repülőtérről induló járatokat kéne visszaküldenie', () => {
        jaratKezelo.ujJarat('ASD6969', 'LOS', 'GRU', new Date('2024-06-01T10:00:00Z'));
        jaratKezelo.ujJarat('ASDFGH', 'LOS', 'MEL', new Date('2024-06-01T12:00:00Z'));
        jaratKezelo.ujJarat('XYZ222', 'GRU', 'LOS', new Date('2024-06-01T14:00:00Z'));

        const jaratok = jaratKezelo.jaratokRepuloterrol('LOS');
        expect(jaratok).toEqual(['ASD6969', 'ASDFGH']);
    });

    it('hibaüzenetet kéne dobnija az üres járatszámra', () => {
        expect(() => {
            jaratKezelo.ujJarat('', 'BUD', 'JFK', new Date('2024-06-01T10:00:00Z'));
        }).toThrow('A járatszámnak egyedinek kell lennie!');
    });
    
    it('hibát kéne dobnija a null járatszámra', () => {
        expect(() => {
            jaratKezelo.ujJarat(null as any, 'BUD', 'JFK', new Date('2024-06-01T10:00:00Z'));
        }).toThrow('A járatszámnak egyedinek kell lennie!');
    });

    it('hibaüzenetet kéne dobnija nem létező járatkésés miatt', () => {
        expect(() => {
            jaratKezelo.keses('NONEXISTENT', 30);
        }).toThrow('Nem létező járat!');
    });

    it('üres listát kéne visszaadnia', () => {
        const jaratok = jaratKezelo.jaratokRepuloterrol('XYZ');
        expect(jaratok).toEqual([]);
    });
    
    it('hibaüzenetet kéne dobnija az üres repülőtér kódhoz', () => {
        expect(() => {
            jaratKezelo.jaratokRepuloterrol('');
        }).toThrow('A reptér kódja nem lehet üres!');
    });
    
    it('hibát kéne dobnija a null repülőtéri kódhoz', () => {
        expect(() => {
            jaratKezelo.jaratokRepuloterrol(null as any);
        }).toThrow('A reptér kódja nem lehet üres!');
    });
});
