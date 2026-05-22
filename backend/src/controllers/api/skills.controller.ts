import type { Request, Response } from 'express';
import {
  deleteSkill,
  findExternalSkills,
  getSkill,
  importSkill,
  installGlobalSkill,
  installMarketplaceSkill,
  listSkills,
  previewMarketplaceSkill,
  refreshMarketplace,
  searchMarketplace,
  updateSkillStatus,
  validateSkill,
} from 'services/opencode-control/skills.service.js';
import { noContent, ok, param } from './http.js';

export async function list(req: Request, res: Response) {
  ok(res, await listSkills(param(req, 'projectId'), {
    scope: typeof req.query.scope === 'string' ? req.query.scope : undefined,
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
  }));
}

export async function detail(req: Request, res: Response) {
  ok(res, await getSkill(param(req, 'projectId'), param(req, 'skillName')));
}

export async function externalFind(req: Request, res: Response) {
  ok(res, await findExternalSkills(req.body));
}

export async function installGlobal(req: Request, res: Response) {
  ok(res, await installGlobalSkill(req.body), undefined, 201);
}

export async function validate(req: Request, res: Response) {
  ok(res, await validateSkill(req.body));
}

export async function importProjectSkill(req: Request, res: Response) {
  ok(res, await importSkill(param(req, 'projectId'), req.body), undefined, 202);
}

export async function updateStatus(req: Request, res: Response) {
  ok(res, await updateSkillStatus(param(req, 'projectId'), param(req, 'skillName'), req.body));
}

export async function remove(req: Request, res: Response) {
  await deleteSkill(param(req, 'projectId'), param(req, 'skillName'));
  noContent(res);
}

export async function marketplace(req: Request, res: Response) {
  const result = await searchMarketplace({
    q: typeof req.query.q === 'string' ? req.query.q : undefined,
    source: typeof req.query.source === 'string' ? req.query.source : undefined,
    trustLevel: typeof req.query.trustLevel === 'string' ? req.query.trustLevel : undefined,
    page: Number(req.query.page),
    pageSize: Number(req.query.pageSize),
  });
  ok(res, result.data, result.meta);
}

export async function marketplacePreview(req: Request, res: Response) {
  ok(res, await previewMarketplaceSkill(param(req, 'marketplaceSkillId')));
}

export async function install(req: Request, res: Response) {
  ok(res, await installMarketplaceSkill(param(req, 'projectId'), req.body), undefined, 202);
}

export async function refresh(req: Request, res: Response) {
  ok(res, await refreshMarketplace(req.body));
}
