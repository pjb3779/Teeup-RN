package com.teeup.teeup_backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadFileToS3(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IOException("파일이 비어 있습니다.");

        String fileName = UUID.randomUUID().toString() + getFileExtension(file);
        String objectKey = "avatars/" + fileName;

        try (InputStream input = file.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            amazonS3.putObject(bucketName, objectKey, input, metadata);
        }

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, objectKey);
    }

    private String getFileExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        return (name != null && name.contains(".")) ? name.substring(name.lastIndexOf(".")) : "";
    }
}
