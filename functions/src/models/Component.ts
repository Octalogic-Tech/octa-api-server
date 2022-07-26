import { v4 as uuid } from "uuid";
import admin from "firebase-admin";
import Category from "./Category";
import Project from "./Project";
import Technology from "./Technology";
import componentSchema from "~schemas/ComponentSchema";
import { IImageUploadModel } from "~interfaces/IImageUploadModel";
import { IComponentLink } from "~interfaces/IComponentLink";
import { IGalleryItem } from "~interfaces/IGalleryItem";
import { STATUS_ACTIVE } from "~utils/constants";
import { ICloudStorageUploadResponse } from "~interfaces/ICloudStorageUploadResponse";
import { generatePublicLink } from "~utils/fileHelper";

class Component {
  public static init = (
    name: string,
    projectRef: FirebaseFirestore.DocumentReference,
    categoryRef: FirebaseFirestore.DocumentReference,
    technologyRefs: FirebaseFirestore.DocumentReference[] = [],
    links: string[] = [],
    summary: string = null,
    description: string = null,
  ) => {
    const id = uuid();

    return {
      id,
      name,
      summary,
      description,
      cover: null,
      logo: null,
      gallery: [],
      category: categoryRef,
      project: projectRef,
      technology: technologyRefs,
      links,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public static initGalleryItem = (
    file: ICloudStorageUploadResponse,
    name?: string,
    description?: string,
  ) => {
    const id = uuid();

    return admin.firestore.FieldValue.arrayUnion({
      id,
      name: name || null,
      description: description || null,
      link: generatePublicLink(file),
      meta: file,
    });
  };

  public id: string;
  public name: string;
  public summary: string;
  public description: string;
  public cover: IImageUploadModel;
  public logo: IImageUploadModel;
  public category: Category;
  public project: Project;
  public technology: Technology[];
  public gallery: IGalleryItem[];
  public links: IComponentLink[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    try {
      const validatedPayload = this.validate(payload);
      this.id = validatedPayload.id;
      this.name = validatedPayload.name;
      this.summary = validatedPayload.summary;
      this.description = validatedPayload.description;
      this.cover = validatedPayload.cover;
      this.logo = validatedPayload.logo;
      this.category = new Category(validatedPayload.category);
      this.project = new Project(validatedPayload.project);
      this.technology = validatedPayload.technology.map((technology) => new Technology(technology));
      this.gallery = validatedPayload.gallery;
      this.links = validatedPayload.links;
      this.createdAt = validatedPayload.createdAt;
      this.updatedAt = validatedPayload.updatedAt;
    } catch (error) {
      throw error;
    }
  }

  private validate = (payload) => {
    try {
      return componentSchema().validateSync(payload, {
        abortEarly: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default Component;
