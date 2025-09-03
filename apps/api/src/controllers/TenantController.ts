import { Request, Response } from 'express';
import { TenantModel } from '../models/Tenant';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '../utils/response';
import { logger } from '../utils/logger';

export class TenantController {
  async getAllTenants(req: Request, res: Response): Promise<void> {
    try {
      const tenants = await TenantModel.find({ status: 'active' });
      const response = createSuccessResponse(tenants);
      res.status(200).json(response);
    } catch (error) {
      logger.error('Error fetching tenants', { error });
      const response = createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tenants',
      }, 500);
      res.status(500).json(response);
    }
  }

  async getTenantById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenant = await TenantModel.findById(id);
      
      if (!tenant) {
        const response = createNotFoundResponse('Tenant');
        res.status(404).json(response);
        return;
      }
      
      const response = createSuccessResponse(tenant);
      res.status(200).json(response);
    } catch (error) {
      logger.error('Error fetching tenant', { error });
      const response = createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tenant',
      }, 500);
      res.status(500).json(response);
    }
  }

  async createTenant(req: Request, res: Response): Promise<void> {
    try {
      const tenant = new TenantModel(req.body);
      await tenant.save();
      
      const response = createSuccessResponse(tenant, 201);
      res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating tenant', { error });
      const response = createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create tenant',
      }, 500);
      res.status(500).json(response);
    }
  }

  async updateTenant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenant = await TenantModel.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!tenant) {
        const response = createNotFoundResponse('Tenant');
        res.status(404).json(response);
        return;
      }
      
      const response = createSuccessResponse(tenant);
      res.status(200).json(response);
    } catch (error) {
      logger.error('Error updating tenant', { error });
      const response = createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update tenant',
      }, 500);
      res.status(500).json(response);
    }
  }

  async deleteTenant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tenant = await TenantModel.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
      
      if (!tenant) {
        const response = createNotFoundResponse('Tenant');
        res.status(404).json(response);
        return;
      }
      
      const response = createSuccessResponse({ message: 'Tenant deleted successfully' });
      res.status(200).json(response);
    } catch (error) {
      logger.error('Error deleting tenant', { error });
      const response = createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete tenant',
      }, 500);
      res.status(500).json(response);
    }
  }
}