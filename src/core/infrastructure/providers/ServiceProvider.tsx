"use client";
import { createContext, useContext, useEffect } from 'react';
import { ServiceRegistry, ServiceType } from '../registry/service.registry';

const ServiceContext = createContext<typeof ServiceRegistry | null>(null);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        ServiceRegistry.initialize();
        return () => {
            ServiceRegistry.reset();
        };
    }, []);

    return (
        <ServiceContext.Provider value={ServiceRegistry}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = <K extends keyof ServiceType>(serviceName: K) => {
    const registry = useContext(ServiceContext);
    if (!registry) {
        throw new Error('useService must be used within ServiceProvider');
    }
    return registry.get(serviceName);
};
