import { NextApiRequest, NextApiResponse } from "next";
interface INextApiRouter {
    post(url: string, api: Function): INextApiRouter;
    get(url: string, api: Function): INextApiRouter;
    put(url: string, api: Function): INextApiRouter;
    delete(url: string, api: Function): INextApiRouter;
    routes(): void;
}
declare class NextApiRouter implements INextApiRouter {
    private readonly response;
    private readonly request;
    private readonly method;
    private readonly slugs;
    private readonly hashMap;
    constructor(req: NextApiRequest, res: NextApiResponse);
    private pathValidation;
    private errorResponse;
    private addRequestPathParams;
    private apiPathFilter;
    post(url: string, api: Function): INextApiRouter;
    get(url: string, api: Function): INextApiRouter;
    put(url: string, api: Function): INextApiRouter;
    delete(url: string, api: Function): INextApiRouter;
    routes(): void;
}
export default NextApiRouter;
