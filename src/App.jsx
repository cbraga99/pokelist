import React, { useState, useEffect, useRef } from 'react';

export default function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 12;
    const loadingRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) {
                loadPokemon();
            }
        });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => observer.disconnect();
    }, [loading]);

    useEffect(() => {
        loadPokemon();
    }, []);

    async function fetchPokemon(id) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data;
    }

    async function loadPokemon() {
        setLoading(true);

        const newPokemonList = [];
        for (let i = offset + 1; i <= offset + limit; i++) {
            const pokemon = await fetchPokemon(i);
            newPokemonList.push(pokemon);
        }

        setPokemonList(prevList => [...prevList, ...newPokemonList]);
        setOffset(prevOffset => prevOffset + limit);
        setLoading(false);
    }

    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {pokemonList.map(pokemon => (
                    <li key={pokemon.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`} alt={pokemon.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                        <span>{pokemon.name}</span>
                    </li>
                ))}
            </ul>
            {loading && <div>Carregando...</div>}
            <div ref={loadingRef}></div>
        </div>
    );
}
