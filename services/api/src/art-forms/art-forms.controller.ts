import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ArtFormsService } from "./art-forms.service";

@Controller("art-forms")
export class ArtFormsController {
  constructor(private readonly artFormsService: ArtFormsService) {}

  @Get()
  findAll() {
    return this.artFormsService.findAll();
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    const artForm = await this.artFormsService.findBySlug(slug);
    if (!artForm) {
      throw new NotFoundException("Art form not found");
    }
    return artForm;
  }
}
