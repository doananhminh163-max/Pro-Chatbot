import { Request, Response, NextFunction } from 'express';

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    if (user?.role?.name === "Admin") {
        next();
    } else {
        res.redirect("/error");
    }
}
