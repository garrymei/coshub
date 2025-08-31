import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto, QuerySkillsDto } from './dto';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skills: SkillsService) {}

  @Post()
  @ApiCreatedResponse({ description: '创建技能帖' })
  create(@Body() dto: CreateSkillDto) {
    return this.skills.create(dto as any);
  }

  @Get()
  @ApiOkResponse({ description: '技能帖列表' })
  findAll(@Query() query: QuerySkillsDto) {
    const page = query.page ? parseInt(query.page, 10) || 1 : 1;
    const lat = query.lat ? parseFloat(query.lat) : undefined;
    const lng = query.lng ? parseFloat(query.lng) : undefined;
    const radius = query.radius ? parseFloat(query.radius) : undefined;
    return this.skills.findAll({ city: query.city, role: query.role, page, pageSize: 10, lat, lng, radius });
  }

  @Get(':id')
  @ApiOkResponse({ description: '技能帖详情' })
  findOne(@Param('id') id: string) {
    return this.skills.findById(id);
  }
}


