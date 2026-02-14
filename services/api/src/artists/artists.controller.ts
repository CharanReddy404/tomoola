import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/user.decorator";

@Controller("artists")
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { userId: string; role: string },
    @Body() createArtistDto: CreateArtistDto,
  ) {
    return this.artistsService.create(user.userId, createArtistDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = await this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException("Artist profile not found");
    }
    if (artist.userId !== user.userId) {
      throw new ForbiddenException("You can only update your own profile");
    }
    return this.artistsService.update(id, updateArtistDto);
  }

  @Get()
  findAll(
    @Query("artForm") artForm?: string,
    @Query("city") city?: string,
    @Query("search") search?: string,
  ) {
    return this.artistsService.findAll({ artForm, city, search });
  }

  @Get("art-form/:slug")
  findByArtForm(@Param("slug") slug: string) {
    return this.artistsService.findByArtFormSlug(slug);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const artist = await this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException("Artist profile not found");
    }
    return artist;
  }
}
