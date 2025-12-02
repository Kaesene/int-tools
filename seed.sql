-- Inserir categorias iniciais
INSERT INTO categories (name, slug, image_url, created_at)
VALUES
  ('Ferramentas Manuais', 'ferramentas-manuais', NULL, NOW()),
  ('Ferramentas Elétricas', 'ferramentas-eletricas', NULL, NOW()),
  ('Ferramentas de Jardim', 'ferramentas-de-jardim', NULL, NOW()),
  ('Equipamentos de Segurança', 'equipamentos-de-seguranca', NULL, NOW()),
  ('Acessórios', 'acessorios', NULL, NOW()),
  ('Medição e Nivelamento', 'medicao-e-nivelamento', NULL, NOW())
ON CONFLICT (slug) DO NOTHING;
