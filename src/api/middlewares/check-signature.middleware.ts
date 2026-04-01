// import { di } from '@config';
// import { appConfig } from '@main';
// import { ApiError } from '@api/errors';
// import { CryptoService } from '@api/services';
// import { FastifyReply, FastifyRequest } from 'fastify';

// export const checkSignatureMiddleware = () => {
//   return async (req: FastifyRequest, reply: FastifyReply) => {
//     if (appConfig.NODE_ENV == 'dev') {
//       return;
//     }
//     if (req.originalUrl.startsWith('/docs') || req.originalUrl == '/favicon.ico') {
//       return;
//     }
//     const cryptoService = di.container.resolve<CryptoService>('cryptoService');
//     const userAgent = req.headers['user-agent'];
//     const version = req.headers['fastify-version'];
//     const timestamp = req.headers['fastify-timestamp'];
//     const receivedSignature = req.headers['fastify-token'];
//     if (!version || !timestamp) {
//       await SignatureCheckLog.create({
//         version,
//         timestamp,
//         userAgent,
//         body: req.body,
//         receivedSignature,
//         url: req.originalUrl,
//         user: req.actor?.getUser,
//         calculatedSignature: null,
//         description: 'Не переданы поля',
//         userDevice: req.actor?.getUserDevice,
//       });
//       throw ApiError.forbidden();
//     }
//     const salt = cryptoService.encodeToSHA256(appConfig.SIGNATURE_SECRET + version);
//     const calculatedSignature = cryptoService.encodeToSHA256(
//       salt + req.originalUrl + timestamp
//     );
//     if (receivedSignature != calculatedSignature) {
//       await SignatureCheckLog.create({
//         version,
//         timestamp,
//         userAgent,
//         body: req.body,
//         receivedSignature,
//         calculatedSignature,
//         url: req.originalUrl,
//         user: req.actor?.getUser,
//         userDevice: req.actor?.getUserDevice,
//         description: 'Не совпадают сигнатуры',
//       });
//       throw ApiError.forbidden();
//     }
//   };
// };
