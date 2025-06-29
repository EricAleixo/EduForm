import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

export const configureCloudinary = (configService: ConfigService) => {
    cloudinary.config({
        api_key: configService.get<string>("CLOUD_API_KEY"),
        api_secret: configService.get<string>("CLOUD_API_SECRET"),
        cloud_name: configService.get<string>("CLOUD_NAME")
    })
}