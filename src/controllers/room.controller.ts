import { Controller } from '@nestjs/common';
import { ROOM_ROUTES } from 'routes/room.routes';

@Controller({ path: ROOM_ROUTES.DEFAULT })
export class RoomController {}
