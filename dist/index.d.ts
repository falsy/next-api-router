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
    private readonly apiMap;
    private postApiMap;
    private getApiMap;
    private putApiMap;
    private deleteApiMap;
    constructor(req: NextApiRequest, res: NextApiResponse);
    private generateApiMap;
    private errorResponse;
    post(url: string, api: Function): INextApiRouter;
    get(url: string, api: Function): INextApiRouter;
    put(url: string, api: Function): INextApiRouter;
    delete(url: string, api: Function): INextApiRouter;
    routes(): void;
}
export default NextApiRouter;
