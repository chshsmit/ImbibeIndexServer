export interface Collection {
  type: "recipe" | "collection";
  name: string;
  id: string;
  subCollections: Array<string>;
  parent: string | null;
}

export const CollectionMap: Map<string, Collection> = new Map<
  string,
  Collection
>([
  [
    "recipes-collection",
    {
      type: "collection",
      name: "Recipes",
      id: "recipes-collection",
      subCollections: ["collection-1", "collection-2", "recipe-1"],
      parent: null,
    },
  ],
  [
    "collection-1",
    {
      type: "collection",
      name: "Collection 1",
      id: "collection-1",
      subCollections: ["other-collection"],
      parent: "recipes-collection",
    },
  ],
  [
    "other-collection",
    {
      type: "collection",
      name: "Other Collection",
      id: "other-collection",
      subCollections: ["other-recipe"],
      parent: "collection-1",
    },
  ],
  [
    "other-recipe",
    {
      type: "recipe",
      name: "Other Recipe",
      id: "other-recipe",
      subCollections: [],
      parent: "other-collection",
    },
  ],
  [
    "collection-2",
    {
      type: "collection",
      name: "Collection 2",
      id: "collection-2",
      subCollections: [],
      parent: "recipes-collection",
    },
  ],
  [
    "recipe-1",
    {
      type: "recipe",
      name: "Recipe 1",
      id: "recipe-1",
      subCollections: [],
      parent: "recipes-collection",
    },
  ],
]);
