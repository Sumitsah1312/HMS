// using Amazon;
// using Amazon.S3;
// using Amazon.S3.Transfer;
// using SetikaHrms.TenantService.Api.Interfaces;

// namespace SetikaHrms.TenantService.Api.Helpers
// {
//     public class StorageService(IConfiguration _config, IGeneralService _generalService) : IStorageService
//     {
//         public async Task<S3ResponseModel> UploadFileAsync(IFormFile? file, string FolderName)
//         {
//             if (file == null || file.Length == 0)
//                 throw new ArgumentException("Invalid file");

//             string bucketName = _config["AwsConfiguration:setikaHrmsData:BucketName"] ?? "";
//             string accessKey = _config["AwsConfiguration:setikaHrmsData:AWSAccessKey"] ?? "";
//             string secretKey = _config["AwsConfiguration:setikaHrmsData:AWSSecretKey"] ?? "";
//             string fileName = file.FileName.Replace(" ", "").Replace(@"\", "/");

//             var response = new S3ResponseModel();

//             try
//             {
//                 var folder = FolderName?.TrimEnd('/') + "/";
//                 var s3Key = folder + fileName;

//                 using (var stream = file.OpenReadStream())
//                 {
//                     var uploadRequest = new TransferUtilityUploadRequest
//                     {
//                         InputStream = stream,
//                         Key = s3Key,
//                         BucketName = bucketName,
//                         ContentType = file.ContentType,
//                         //CannedACL = S3CannedACL.PublicRead
//                     };

//                     using (var s3Client = new AmazonS3Client(
//                         accessKey,
//                         secretKey,
//                         new AmazonS3Config
//                         {
//                             RegionEndpoint = RegionEndpoint.APSouth1 // ✅ Mumbai region
//                         }))
//                     {
//                         var transferUtility = new TransferUtility(s3Client);
//                         await transferUtility.UploadAsync(uploadRequest);

//                         response.Success = true;
//                         response.Message = "File has been uploaded successfully";
//                         response.FilePath = s3Key;
//                         response.FileName = fileName;
//                         return response;
//                     }
//                 }
//             }
//             catch (AmazonS3Exception s3Ex)
//             {
//                 response.Message = s3Ex.Message;
//                 await _generalService.SendErrorEmail(s3Ex.ToString());
//             }
//             catch (Exception ex)
//             {
//                 response.Message = ex.Message;
//                 await _generalService.SendErrorEmail(ex.ToString());
//             }

//             return response;
//         }

//         //public async Task<S3ResponseModel> UploadFileAsync(IFormFile? file, string FolderName)
//         //{
//         //    if (file == null || file.Length == 0)
//         //        throw new ArgumentException("Invalid file");

//         //    string _bucketName = _config["AwsConfiguration:setikaHrmsData:BucketName"] ?? "";
//         //    string fileName = file.FileName().Replace(" ", "").Replace(@"\", "/");

//         //    var response = new S3ResponseModel();
//         //    try
//         //    {
//         //        var folder = FolderName?.TrimEnd('/') + "/";
//         //        var s3Key = folder + fileName;

//         //        using (var stream = file.OpenReadStream())
//         //        {
//         //            var uploadRequest = new TransferUtilityUploadRequest
//         //            {
//         //                InputStream = stream,
//         //                Key = s3Key,
//         //                BucketName = _bucketName,
//         //                ContentType = file.ContentType,
//         //                CannedACL = S3CannedACL.PublicRead
//         //            };
//         //            using (var _s3Client = new AmazonS3Client())
//         //            {
//         //                var transferUtility = new TransferUtility(_s3Client);
//         //                await transferUtility.UploadAsync(uploadRequest);

//         //                response.Success = true;
//         //                response.Message = "file has been uploaded sucessfully";
//         //                response.FilePath = s3Key;
//         //                response.FileName = fileName;
//         //                return response;
//         //            }
//         //        }
//         //    }
//         //    catch (AmazonS3Exception s3Ex)
//         //    {
//         //        response.Message = s3Ex.Message;
//         //        await _generalService.SendErrorEmail(s3Ex.ToString());
//         //    }
//         //    catch (Exception ex)
//         //    {
//         //        response.Message = ex.Message;
//         //        await _generalService.SendErrorEmail(ex.ToString());
//         //    }
//         //    return response;
//         //}
//     }
// }
