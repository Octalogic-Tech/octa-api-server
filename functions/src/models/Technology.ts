import { v4 as uuid } from "uuid";
import Category from "./Category";
import schema from "~schemas/TechnologySchema";
import { STATUS_ACTIVE } from "~utils/constants";
import { IIcon } from "~interfaces/IIcon";

class Technology {
  public static init = (
    name: string,
    categoryRef: FirebaseFirestore.DocumentReference,
    link?: string,
    icon?: IIcon,
  ) => {
    const id = uuid();

    const obj: any = {
      id,
      name,
      icon: icon || null,
      status: STATUS_ACTIVE,
      category: categoryRef,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (link) obj.link = link;

    return obj;
  };

  public id: string;
  public name: string;
  public link?: string;
  public icon?: IIcon;
  public category: Category;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    const validatedPayload = this.validate(payload);
    this.id = validatedPayload.id;
    this.name = validatedPayload.name;
    this.link = validatedPayload.link;
    this.icon = validatedPayload.icon;
    this.category = new Category(validatedPayload.category);
    this.createdAt = validatedPayload.createdAt;
    this.updatedAt = validatedPayload.updatedAt;
  }

  private validate = (payload) => {
    try {
      return schema().validateSync(payload);
    } catch (error) {
      throw error;
    }
  };
}

export default Technology;
