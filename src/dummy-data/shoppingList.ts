import { ShoppingList } from "../models/shopping.model";

export const dummyList : ShoppingList = [
    {
        _id: '0',
        name: "Ez egy dummy shopping list a be nem jelentkezett felhasználók számára.",
        completed: false
    },
    {
        _id: '1',
        name: "A listán végzett műveletek nem jutnak el a szerverig.",
        completed: false
    },
    {
        _id: '2',
        quantity: 3,
        name: "paradicsom",
        completed: false
    },
    {
        _id: '3',
        quantity: 1,
        unit: 'kg',
        name: "csirkemell filé",
        completed: false
    },
    {
        _id: '4',
        quantity: 3,
        unit: 'db',
        name: "krémtúró",
        note: "milli",
        completed: false
    },
    {
        _id: '5',
        quantity: 3,
        unit: 'szál',
        name: "újhagyma",
        completed: true
    },
    {
        _id: '6',
        quantity: 400,
        unit: 'ml',
        name: "főzőtejszín",
        note: "20%-os",
        completed: false
    },
    {
        _id: '7',
        quantity: 4,
        unit: 'l',
        name: "tej",
        completed: true
    },
    {
        _id: '8',
        quantity: 2,
        name: "banán",
        completed: false
    },
];