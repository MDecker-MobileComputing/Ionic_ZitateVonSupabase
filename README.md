# Ionic-App "Zitate von Supabase" #

<br>

Dieses Repo enthält das Quellcode-Projekt für eine einfache Ionic/Angular-App, 
die mit [CapacitorHttp](https://capacitorjs.com/docs/apis/http) von einer auf 
[Supabase](https://supabase.com/) gehosteten REST-API abzurufen.

<br>

----

## Backend auf Supabase einrichten ##

<br>

```
	-- 1) Tabelle anlegen
	CREATE TABLE IF NOT EXISTS public.zitate (
		id SERIAL PRIMARY KEY,
		zitat TEXT NOT NULL,
		autor TEXT NOT NULL
	);

	-- 2) Optional: Beispiel-Daten
	INSERT INTO public.zitate (zitat, autor)
	VALUES
		('Talk is cheap. Show me the code.', 'Linus Torvalds'),
		('Programs must be written for people to read, and only incidentally for machines to execute.', 'Harold Abelson'),
		('Simplicity is prerequisite for reliability.', 'Edsger W. Dijkstra')
	ON CONFLICT DO NOTHING;

	-- 3) Sicherstellen, dass "Row Level Security" (RLS) eingeschaltet ist
	ALTER TABLE public.zitate ENABLE ROW LEVEL SECURITY;

	-- 4) Funktion anlegen:
	--    SECURITY DEFINER, damit die Funktion mit den Rechten des Owners läuft
	--    SET search_path = '' laut Supabase-Empfehlung
	CREATE OR REPLACE FUNCTION public.get_zufaelliges_zitat()
	RETURNS TABLE(zitat TEXT, autor TEXT)
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path = ''
	AS $$
	BEGIN
	  RETURN QUERY
        SELECT z.zitat, z.autor
            FROM public.zitate z
            ORDER BY RANDOM()
            LIMIT 1;
	END;
	$$;

	-- 5) Direkte Rechte auf die Tabelle für anon entziehen
	REVOKE ALL ON TABLE public.zitate FROM anon;
	REVOKE ALL ON TABLE public.zitate FROM authenticated;
```

<br>

----

## License ##

<br>

See the [LICENSE file](LICENSE.md) for license rights and limitations (BSD 3-Clause License) for the files in this repository.

<br>
