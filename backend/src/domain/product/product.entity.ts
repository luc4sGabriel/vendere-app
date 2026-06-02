export class ProductEntity {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly description: string | null,
      public readonly price: number,
      public readonly stock: number,
      public readonly imageUrl: string | null,
      public readonly active: boolean,
      public readonly categoryId: string,
      public readonly createdAt: Date
    ) {}
  }